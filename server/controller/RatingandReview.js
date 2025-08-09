const RatingandReview = require("../model/ratingandReview");
const Course = require("../model/course");
const ratingandReview = require("../model/ratingandReview");
const mongoose = require("mongoose")





//getRating
exports.createRating= async (req,res)=>{
    try{
        //getUser id
        const userId = req.user.id
        //fetch Data from req body
        const {rating,review,courseId,} = req.body
        // check if user is enrolled or not
         const courseDetail =  await Course.findOne(
            {_id:courseId,
                 studentsEnrolled:{$elemMatch:{$el:userId}}
             
         });
 if(!courseDetail){
    return res.status(501).json({
        status:false,
        message:`student is not enrolled in the course`
    })
 };
 const alreadyReview = await RatingandReview.findOne({
    user:userId,
    course:courseId
 });
 if(alreadyReview){
    return res.status(403).json({
       success:false,
       message:`course is already reviwed by the user`  
    })
 }
// create rating and review
 const ratingReview = await ratingandReview.create({
    rating,review,
    course:courseId,
    user:userId,
 })
 // update course with this rating / review
 const updatedCourseDetail = await Course.findByIdAndUpdate({_id:courseId},
     {
        $push:{
         ratingAndReviews:ratingReview._id,
          }
     },{new:true});

     console.log("updated rating ",updatedCourseDetail);
     // return response 
     return res.status(200).json({
      success:true,
      message:"Rating and reviewing SucessFully",
      ratingReview,
     })
    }catch(err){
    console.log(err);
    return res.status(500).json({
       success:false,
       message:err.message,
    })
    }
}

// getAverage Rating
exports.getAverageRating = async(req,res)=>{
   try{
      //get Course Id
      const courseId = req.body.courseId
      //calculate average Rating
      const result = await RatingandReview.aggregate([
       { $match:{
           course : new mongoose.Types.ObjectId(courseId)
         }
      },
      {
         $group:{
             _id:null,
             averageRating:{$avg:"$rating"} ,
         }
      }
      ])
      //return rating
      if(result.length>0){
         return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating,
         })
      }
      // if no rating // review exist
      return res.status(200).json({
         success:true,
         message:"Average rating is zero till now",
         averageRating:0,
      })

   }catch(err){
      console.log(err);
      return res.status(500).json({
         success:false,
         message:err.message,
      }) 
}
}

//getAllrating
exports.getAllRating = async(req,res)=>{
   try{
          const allRating = await RatingandReview.find({})
            .sort({rating:"desc"})
            .populate({
              path:"user" ,
              select:"firstName lastName email image",
            })
            .populate({
             path:"course",
             select:"courseName"
            })
            .exec();
            return res.status(200).json({
               success:true,
               message:"All review fetch Successfully",
               data:allRating
            })
   }catch(err){
      console.log(err)
      return res.status(500).json({
         success:false,
         message:err.message,
      })
   }
}