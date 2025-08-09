const Tags = require("../model/Category");
const User = require("../model/User");
const Course = require("../model/course");
const {uploadImageTocloudinary}= require("../utilis/imageUploader");
// create Course handler
exports.createCourse = async(req,res)=>{
    try{
        // get data
        const{courseName,courseDescription,whatYouWillLearn,price,tags}=req.body;
        // getthumbnails
        const thumbnails = req.files.thumbnailsImage;
        //validations
        if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tags){
            return res.status(400).json({
                 success:false,
                 message:"All Data required to fullfill"
            });

        }
        // check for instructor
        const userId = req.user.id;
        const instructorDetail=await User.findById(userId);
        console.log("Instructor Detail",instructorDetail);
        if(!instructorDetail){
            return res.status(401).json({
                success:false,
                message:"Instructor is not found"
           });
        }
        // check  given tag detail is valid or not
        const tagDetail = await Tags.findById(tags);
        if(!tagDetail){
            return res.status(401).json({
                success:false,
                message:"Tagdetail is not found"
           });
        }
        // upload Image to cloudinary
        const thumbnailsImage = await uploadImageTocloudinary(thumbnails,process.env.FOLDER_NAME);
        // create an entry for new courses
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn:whatYouWillLearn,
            instructor:instructorDetail._id,
            price,
            tags:tagDetail._id,
            thumbnails:thumbnailsImage.secure_url,

        });
        // add the new cousre to the user  Schema Instructor
        await User.findByIdAndUpdate({
           _id:instructorDetail._id },
           {$push:{
            courses:newCourse._id,
           }},{new:true});
           // update tags Schema HW
           return res.status(200).json({
            success:true,
            message:"Courses Created Successfully"
       });

    }catch(error){
        return res.status(401).json({
            success:false,
            message:error.message
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
    const courseDetail  = await Course.find(
        {_id:courseId})
        .populate(
            {
           path:"instructor",
           populate:{
            path:"additionaldetails"
           }
        })
        .populate("ratingAndReviews")
        .populate("category")
        .populate({
            path:"courseContent",
            populate:{
                path:"SubSection",
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