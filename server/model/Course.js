const mongoose = require("mongoose")

const courseSchema =new mongoose.Schema(
  {
    courseName:{
      type:String,
      required:true
    },
    courseDescription:{
       type:String,
      required:true
    },
    whatYouWillLearn:{
       type:String,
      required:true
    },
    price:{
      type: Number,
       required: true
    },
     tags: { 
      type: [String], 
      required: true 
    },
     thumbnails: {
      type: String,   // store Cloudinary URL
      required: true
    },

  }

)

module.exports = mongoose.models.course || mongoose.model("course", courseSchema)

