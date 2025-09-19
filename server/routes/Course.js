// Import the required modules
const express = require("express")
const router = express.Router()
const upload = require("../middleware/multer")
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

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************
// Courses can Only be Created by Instructors
router.post("/createCourse", auth,
   isInstructor,
  // (req, res, next) => {
  //   console.log("Incoming headers:", req.headers["content-type"]);
  //   next();
  // },
 upload.single('thumbnails'), function (req, res) {
  // req.file is the name of your file in the form above, here 'uploaded_file'
  // req.body will hold the text fields, if there were any
  console.log(req.file, req.body)
},
    createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor,
       upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
]),
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