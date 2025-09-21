const Category = require("../model/Category");
const User = require("../model/User");
const course = require("../model/Course")
 const { uploadImageToCloudinary}= require("../utilis/imageUploader");
// create Course handler
exports.createCourse = async(req,res)=>{
  try{
  console.log("Inside the createCourseController")
  console.log("req Body",req.body);
  const {courseName,courseDescription,whatYouWillLearn,price,tags} = req.body
          //check for the instructor 
   const userId = req.User.id;
        console.log("UserId Controller", userId)
         const instructorDetail=await User.findById(userId, {
      accountType: "Instructor",
    });
        console.log("Instructor Detail",instructorDetail);
        if(!instructorDetail){
            return res.status(401).json({
                success:false,
                message:"Instructor is not found"
           });
        }
//TAGS
 if (typeof tags === "string") {
  // If only one tag is passed (e.g. "Add")
  tagDetails = [tags];
} else if (Array.isArray(tags)) {
  tagDetails = tags;
} else {
  return res.status(400).json({
    success: false,
    message: "Tags must be a string or array"
  });
}
 if(!tagDetails){
            return res.status(401).json({
                success:false,
                message:"Tagdetail is not found"
           });
        }


//THUMBNAILS
console.log("req.file",req.files)
 if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

const file = req.files.thumbnails; // get the actual file
const thumbnailImage = await uploadImageToCloudinary(
 file,
      process.env.FOLDER_NAME
);
console.log("thumbnailImage",thumbnailImage);

console.log("issue is here 2")
    const newCourse = await course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            Instructor:instructorDetail._id,
            price,
            tags,
             thumbnails:  thumbnailImage.secure_url,
        });
            console.log("new Course",newCourse);
            console.log("Issue is Resolved ")
        // add the new cousre to the user  Schema Instructor
        await User.findByIdAndUpdate({
           _id:instructorDetail._id },
           {$push:{
            courses:newCourse._id,
           }},{new:true});
           // update tags Schema HW
           return res.status(200).json({
            success:true,
           data:newCourse,
       });
      }catch(error){
         return res.status(401).json({
            success:false,
            message:"CreateCourse Controller is not working "
       });
      }

}
// create getAll course handler
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
};

exports.getCourseDetails = async (req,res)=>{
    try{
        //get id
    const {courseId} = req.body;
    //find courseDetail
    const courseDetail  = await course.find(
        {_id:courseId})
        .populate(
            {
           path:"Instructor",
           populate:{
            path:"additionalDetails"
           }
        })
        // .populate("ratingAndReviews")
        // .populate("category")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();
        //validation 
        if(!courseDetail){
            return res.status(400).json({
              success:false,
              message:`Could not find the course  with  ${courseId}`
            })
        }
        // return response 
        return res.status(200).json({
            success:true,
            message:"Course detail fetch successfully",
            data:courseDetail,

        })

    }catch(err){
   console.log(err);
   return res.status(500).json({
    success:false,
    message:err.message
   });
    }  
}