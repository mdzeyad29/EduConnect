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
    Instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
  courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
  ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    instructions: {
      type: [String],
    },
    status:{
      type:String,
      enum:["Draft","Published"],
      default:"Draft"
    },
  }

)

module.exports = mongoose.models.course || mongoose.model("course", courseSchema)

