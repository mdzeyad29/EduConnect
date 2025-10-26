const Category = require("../model/Category");
const User = require("../model/User");
const course = require("../model/Course");
const Section = require("../model/section");
const SubSection = require("../model/SubSection");
const { uploadImageToCloudinary}= require("../utilis/imageUploader");
// create Course handler
exports.createCourse = async(req,res)=>{
  try{
  console.log("Inside the createCourseController")
  console.log("req Body",req.body);
  const {courseName,courseDescription,whatYouWillLearn,price,tags} = req.body
  let tagDetails;
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
//TAGS: accept JSON stringified array or single string or array
 if (typeof tags === "string") {
  try {
    const maybeArray = JSON.parse(tags);
    if (Array.isArray(maybeArray)) {
      tagDetails = maybeArray;
    } else {
      tagDetails = [tags];
    }
  } catch (e) {
    // not JSON, treat as single tag string
    tagDetails = [tags];
  }
} else if (Array.isArray(tags)) {
  tagDetails = tags;
} else {
  return res.status(400).json({
    success: false,
    message: "Tags must be a string or array",
  });
}
 if(!tagDetails){
            return res.status(401).json({
                success:false,
                message:"Tagdetail is not found"
           });
        }


//THUMBNAILS
console.log("req.file",req.file)
 if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

const file = req.file; // get the actual file
let thumbnailImage;
try {
  thumbnailImage = await uploadImageToCloudinary(
    file,
    process.env.FOLDER_NAME
  );
} catch (uploadError) {
  console.error("Cloudinary upload error:", uploadError);
  
  // Handle specific file size error
  if (uploadError.message && uploadError.message.includes('File size too large')) {
    return res.status(400).json({
      success: false,
      message: "File size too large. Please upload an image smaller than 10MB.",
      error: "FILE_SIZE_EXCEEDED"
    });
  }
  
  // Handle other Cloudinary errors
  return res.status(400).json({
    success: false,
    message: "Failed to upload thumbnail image. Please try again.",
    error: "UPLOAD_FAILED"
  });
}
console.log("thumbnailImage",thumbnailImage);

console.log("issue is here 2")
    const newCourse = await course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            Instructor:instructorDetail._id,
            price,
            tags: tagDetails,
            thumbnails: thumbnailImage.secure_url,
            status: "Draft"
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
         console.error("CreateCourse error:", error);
         
         // Handle specific Cloudinary errors that might not be caught in the upload block
         if (error.message && error.message.includes('File size too large')) {
           return res.status(400).json({
             success: false,
             message: "File size too large. Please upload an image smaller than 10MB.",
             error: "FILE_SIZE_EXCEEDED"
           });
         }
         
         return res.status(500).json({
            success:false,
            message:"Failed to create course. Please try again.",
            error: error?.message || "Unknown error",
       });
      }

}
// create getAll course handler
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnails: true,
				Instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("Instructor")
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

// edit course handler
exports.editCourse = async (req, res) => {
  try {
    console.log("Inside the editCourseController")
    console.log("req Body", req.body);
    
    const { courseId, courseName, courseDescription, whatYouWillLearn, price, tags, status, category, instructions } = req.body;
    
    // Find the course
    const existingCourse = await course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user is the instructor of this course
    const userId = req.User.id;
    if (existingCourse.Instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course"
      });
    }

    // Prepare update object
    const updateData = {};
    
    if (courseName) updateData.courseName = courseName;
    if (courseDescription) updateData.courseDescription = courseDescription;
    if (whatYouWillLearn) updateData.whatYouWillLearn = whatYouWillLearn;
    if (price) updateData.price = price;
    if (status) updateData.status = status;
    if (category) updateData.category = category;
    if (instructions) updateData.instructions = instructions;

    // Handle tags
    if (tags) {
      let tagDetails;
      if (typeof tags === "string") {
        try {
          const maybeArray = JSON.parse(tags);
          if (Array.isArray(maybeArray)) {
            tagDetails = maybeArray;
          } else {
            tagDetails = [tags];
          }
        } catch (e) {
          tagDetails = [tags];
        }
      } else if (Array.isArray(tags)) {
        tagDetails = tags;
      } else {
        return res.status(400).json({
          success: false,
          message: "Tags must be a string or array",
        });
      }
      updateData.tags = tagDetails;
    }

    // Handle thumbnail upload if provided
    if (req.file) {
      try {
        const thumbnailImage = await uploadImageToCloudinary(
          req.file,
          process.env.FOLDER_NAME
        );
        updateData.thumbnails = thumbnailImage.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        
        if (uploadError.message && uploadError.message.includes('File size too large')) {
          return res.status(400).json({
            success: false,
            message: "File size too large. Please upload an image smaller than 10MB.",
            error: "FILE_SIZE_EXCEEDED"
          });
        }
        
        return res.status(400).json({
          success: false,
          message: "Failed to upload thumbnail image. Please try again.",
          error: "UPLOAD_FAILED"
        });
      }
    }

    // Update the course
    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    ).populate("Instructor").populate("category");

    console.log("Updated Course", updatedCourse);

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });

  } catch (error) {
    console.error("EditCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course. Please try again.",
      error: error?.message || "Unknown error",
    });
  }
}

// get all courses by instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const userId = req.User.id;
    
    // Find all courses created by this instructor
    const instructorCourses = await course.find({
      Instructor: userId
    })
    .populate("Instructor")
    .populate("category")
    .sort({ createdAt: -1 })
    .exec();

    return res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error("GetInstructorCourses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor courses",
      error: error?.message || "Unknown error",
    });
  }
}

// delete course handler
exports.deleteCourse = async (req, res) => {
  try {
    console.log("Inside the deleteCourseController");
    console.log("req Body", req.body);
    
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Find the course
    const existingCourse = await course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user is the instructor of this course
    const userId = req.User.id;
    if (existingCourse.Instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course"
      });
    }

    // Delete all subsections associated with this course
    for (const sectionId of existingCourse.courseContent) {
      const section = await Section.findById(sectionId);
      if (section) {
        // Delete all subsections in this section
        for (const subSectionId of section.subSection) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
        // Delete the section
        await Section.findByIdAndDelete(sectionId);
      }
    }

    // Remove course from instructor's courses array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { courses: courseId } },
      { new: true }
    );

    // Delete the course
    await course.findByIdAndDelete(courseId);

    console.log("Course deleted successfully");

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (error) {
    console.error("DeleteCourse error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course. Please try again.",
      error: error?.message || "Unknown error",
    });
  }
}