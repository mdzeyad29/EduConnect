const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseDescription: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  whatYouWillLearn: { type: [String], required: true },
  courseContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  ratingAndReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "viewandrating" }],
  price: { type: Number, required: true },
  thumbnails: { type: String, required: true },
  tags: { type: [String], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
}, { timestamps: true });

module.exports = mongoose.models.course || mongoose.model("course", courseSchema);
