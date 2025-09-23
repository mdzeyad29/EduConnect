const subSection = require("../model/SubSection");
const Section = require("../model/section");
const { uploadImageTocloudinary } = require("../utilis/imageUploader");

//   createSubSection,
exports.createSubSection = async(req,res)=>{
    try{
   // data fetch 
   const {title,timeduration,sectionId,description}= req.body
    //extract video// files
   const video = req.files.videoFile
   // validation
   if(!title||!timeduration||!description||!video||!sectionId){
    return res.status(400).json({
        success:false,
        message:"There is no data in Sub Section ,please full the all detail"
    })
   }
  
   // store in db (cloudinary)//recieve secureUrl
const uploadDetail = await  uploadImageTocloudinary(video);
   //create subsection
   const createSectionDetail =  await  subSection.create({
    title:title,
    description:description,
    timeDuration:timeduration,
    VideoUrl:uploadDetail.secure_url,
   })
   // update subsection with objectId
   const updateSubSection = Section.findByIdAndUpdate({_id:sectionId},
    {
        $push:{
       subSection:createSectionDetail._id,
        },
        
    },{new:true});
    //hw logupdate Section here and adding populate query
   //return response 
   return res.status(500).json({
    success:true,
    message:"Sub are Created Successfully"
   })
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
      const { sectionId, title, description } = req.body
      const subSection = await subSection.findById(sectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageTocloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      return res.json({
        success: true,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
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
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }
