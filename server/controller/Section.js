const courseSchema = require("../model/Course");
const sectionSchema = require("../model/section");

exports.createSectionCourse = async(req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId} = req.body;
        console.log("Inside the createSectionCourse")
        console.log("createSectionCourse Request Body",req.body)
        // data validation
        if(!sectionName|| ! courseId){
            return res.status(400).json({
              success:false,
              message:"There is no data"
            })
        }
        // create section
        const newSection =  await sectionSchema.create({sectionName});
        // update course with objectID
        await courseSchema.findByIdAndUpdate(
          courseId,
          {
            $push: {
              courseContent: newSection._id,
            },
          },
          { new: true }
        )

        // populate sections and subSections for UI
        const updateDetail = await courseSchema
          .findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()

        // return response
        return res.status(200).json({
          success: true,
          message: "Course section created",
          updateDetail,
        })

    }catch(error){
           console.log(error) ;
           return res.status(400).json({
                     success:false,
                     message:"Error in Created Section",
                     error:error.message
           })
    }
}

exports.upDateCourse = async(req,res)=>{
    try{
        // data fetch
        const {sectionName,sectionId} = req.body;
        // data validation
        if(!sectionName|| ! sectionId){
            return res.status(400).json({
              success:false,
              message:"There is no data"
            })
        }
        // update data
        await sectionSchema.findByIdAndUpdate(sectionId, { sectionName }, { new: true })

        // optionally return updated/populated course if courseId provided
        const { courseId } = req.body
        if (courseId) {
          const updateDetail = await courseSchema
            .findById(courseId)
            .populate({
              path: "courseContent",
              populate: { path: "subSection" },
            })
            .exec()
          return res.status(200).json({
            success: true,
            message: "Section updated",
            updateDetail,
          })
        }

        // fallback minimal response
        return res.status(200).json({
          success: true,
          message: "Section updated",
        })
    }catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in  Update The Course Section"
        })
    }
}

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "sectionId and courseId are required",
      })
    }
    // remove section id from course
    await courseSchema.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    )

    // delete the section
    await sectionSchema.findByIdAndDelete(sectionId)

    // return updated/populated course
    const updateDetail = await courseSchema
      .findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec()

    return res.status(200).json({
      success: true,
      message: "Section deleted",
      updateDetail,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Unable to delete, please try again",
      error: error.message,
    })
  }
}