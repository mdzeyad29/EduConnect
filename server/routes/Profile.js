const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/Auth")
const {
  deleteProfile,
  ProfileController,
  getAllUserDetail,
  updateDisplayPicture,
  getEnrolledCourses,
 
} = require("../controller/Profile")


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", deleteProfile)
router.put("/updateProfile", auth, ProfileController)
router.get("/getUserDetails", auth, getAllUserDetail)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

module.exports = router