// Import the required modules
const express = require("express")
const router = express.Router()
// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controller/Courses")


// Categories Controllers Import
const {
   showAllCategories,
  Category ,
  ShowAllPageDetail,
} = require("../controller/Category")

// Sections Controllers Import
const {
  createSectionCourse,
  upDateCourse,
  deleteSection,
} = require("../controller/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controller/subSection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controller/RatingandReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/Auth")
const upload = require("../middleware/multer")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, upload.single("thumbnails"), createCourse)
//Add a Section to a Course api/v1/Course
router.post("/addSection", auth, isInstructor,
  createSectionCourse)
// Update a Section
router.post("/updateSection", auth, isInstructor,upDateCourse)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, Category )
router.get("/showAllCategories",showAllCategories)
router.post("/getCategoryPageDetails", ShowAllPageDetail)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router