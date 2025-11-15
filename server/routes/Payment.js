// Import the required modules
const express = require("express")
const router = express.Router()

const { 
    verifySignature, 
    captureMultiplePayment, 
    EnrlledCourseDetails 
} = require("../controller/Payment")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/Auth")

router.post("/verifySignature", verifySignature)
router.post("/captureMultiplePayment", auth, isStudent, captureMultiplePayment)
router.post("/EnrlledCourseDetails", auth, isStudent, EnrlledCourseDetails)

module.exports = router