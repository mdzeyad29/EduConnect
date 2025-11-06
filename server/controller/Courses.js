const Category = require("../model/Category");
const User = require("../model/User");
const course = require("../model/Course");
const Section = require("../model/section");
const SubSection = require("../model/SubSection");
const CourseProgress = require("../model/coursesProgress");
const { uploadImageToCloudinary}= require("../utilis/imageUploader");

// Helper function to convert seconds to duration format (HH:MM:SS)
const convertSecondsToDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
// create Course handler
exports.createCourse = async(req,res)=>{
  try{
  console.log("Inside the createCourseController")
  console.log("req Body",req.body);
  console.log("Category received:", req.body.category);
  const {courseName,courseDescription,whatYouWillLearn,price,tags,category,status} = req.body
  console.log("Extracted category:", category);
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
    const courseData = {
            courseName,
            courseDescription,
            whatYouWillLearn,
            Instructor:instructorDetail._id,
            price,
            tags: tagDetails,
            thumbnails: thumbnailImage.secure_url,
            status: status || "Draft"
        };
    
    // Only add category if it's provided
    if (category) {
        courseData.category = category;
        console.log("Adding category to course:", category);
    } else {
        console.log("No category provided, course will be created without category");
    }
    
    const newCourse = await course.create(courseData);
            console.log("new Course",newCourse);
            console.log("Course category:", newCourse.category);
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
// Edit Course handler
exports.editCourse = async (req, res) => {
  try {
    console.log("Inside the editCourseController");
    console.log("req Body", req.body);
    
    const { courseId, courseName, courseDescription, whatYouWillLearn, price, tags, status, category } = req.body;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }

    // Check for the instructor
    const userId = req.User.id;
    console.log("UserId Controller", userId);
    
    // Find the course
    const existingCourse = await course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Check if user is the instructor of this course
    if (existingCourse.Instructor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this course"
      });
    }

    // Handle tags - accept JSON stringified array or single string or array
    let tagDetails = existingCourse.tags; // Default to existing tags
    if (tags !== undefined) {
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
    }

    // Handle thumbnail upload if provided
    let thumbnailImage = existingCourse.thumbnails; // Default to existing thumbnail
    if (req.file) {
      console.log("req.file", req.file);
      const file = req.file;
      try {
        thumbnailImage = await uploadImageToCloudinary(
          file,
          process.env.FOLDER_NAME
        );
        thumbnailImage = thumbnailImage.secure_url;
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
    }

    // Build update object with only provided fields
    const updateData = {};
    if (courseName !== undefined) updateData.courseName = courseName;
    if (courseDescription !== undefined) updateData.courseDescription = courseDescription;
    if (whatYouWillLearn !== undefined) updateData.whatYouWillLearn = whatYouWillLearn;
    if (price !== undefined) updateData.price = price;
    if (tagDetails !== undefined) updateData.tags = tagDetails;
    if (thumbnailImage !== undefined) updateData.thumbnails = thumbnailImage;
    if (status !== undefined) {
      if (status === "Draft" || status === "Published") {
        updateData.status = status;
      } else {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'Draft' or 'Published'"
        });
      }
    }
    if (category !== undefined) updateData.category = category;

    // Update the course
    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      { $set: updateData },
      { new: true }
    );

    console.log("Course updated successfully", updatedCourse);

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("EditCourse error:", error);
    
    // Handle specific Cloudinary errors that might not be caught in the upload block
    if (error.message && error.message.includes('File size too large')) {
      return res.status(400).json({
        success: false,
        message: "File size too large. Please upload an image smaller than 10MB.",
        error: "FILE_SIZE_EXCEEDED"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to update course. Please try again.",
      error: error?.message || "Unknown error",
    });
  }
}

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnails: true,
        Instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        category: true,
        courseDescription: true,
      }
    )
      .populate("Instructor")
      .populate("category")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.User.id
    const courseDetails = await course.findOne({
      _id: courseId,
    })
      .populate({
        path: "Instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.User.id

    // Find all courses belonging to the instructor
    const instructorCourses = await course.find({
      Instructor: instructorId,
    })
      .populate("category")
      .sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
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

