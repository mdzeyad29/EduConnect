const subSection = require("../model/SubSection");
const Section = require("../model/section");
const Course = require("../model/Course");
const { uploadImageToCloudinary } = require("../utilis/imageUploader");

// uploadImageToCloudinary
//   createSubSection,
exports.createSubSection = async(req,res)=>{
    try{
   // data fetch 
   const {title,timeduration,sectionId,description}= req.body
    //extract video// files
    console.log("Inside the createSubSection")
    console.log("Request Body is this ",req.body)
    console.log("Start Issue")
   const video = req.file
   console.log("video is this ",video)
   // validation
   if(!title||!description||!video||!sectionId){
    return res.status(400).json({
        success:false,
        message:"There is no data in Sub Section ,please fill all the details"
    })
   }
  
   // store in db (cloudinary)//recieve secureUrl
const uploadDetail = await uploadImageToCloudinary(video);
   //create subsection
   const createSectionDetail =  await  subSection.create({
    title:title,
    description:description,
    timeDuration:timeduration || "",
    videoFile:uploadDetail.secure_url,
   })

   console.log("createSectionDetail",createSectionDetail)
   // update subsection with objectId
   const updateSubSection = await Section.findByIdAndUpdate(
    {_id:sectionId},
    {
        $push:{
       subSection:createSectionDetail._id,
        },
    },{new:true}).populate("subSection");
    //hw logupdate Section here and adding populate query
    console.log("updated Section",updateSubSection)
   // Find the course that contains this section and return the full course
   const course = await Course.findOne({ courseContent: sectionId }).populate({
     path: "courseContent",
     populate: {
       path: "subSection"
     }
   });

   //return response 
   return res.status(200).json({ success: true, data: course })
    }catch(error){
         console.log(error);
         return res.status(501).json({
            success:false,
            message:"Error in SubSection Created ",
            error:error.message
         })
    }

}

// update SubSection 
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSectionDoc = await subSection.findById(subSectionId)
  
      if (!subSectionDoc) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSectionDoc.title = title
      }
  
      if (description !== undefined) {
        subSectionDoc.description = description
      }
      
      if (req.file) {
        const video = req.file
        const uploadDetails = await uploadImageToCloudinary(video)
        subSectionDoc.videoFile = uploadDetails.secure_url
        if (uploadDetails.duration) {
          subSectionDoc.timeDuration = `${uploadDetails.duration}`
        }
      }
  
      await subSectionDoc.save()
      
      // Find the course that contains this section and return the full course
      const course = await Course.findOne({ courseContent: sectionId }).populate({
        path: "courseContent",
        populate: {
          path: "subSection"
        }
      });

      return res.json({
        success: true,
        message: "SubSection updated successfully",
        data: course
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the subsection",
        error: error.message
      })
    }
  }
// delete Section
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSection: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      // Find the course that contains this section and return the full course
      const course = await Course.findOne({ courseContent: sectionId }).populate({
        path: "courseContent",
        populate: {
          path: "subSection"
        }
      });

      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: course
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }
