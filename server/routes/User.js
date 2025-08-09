// Import the required modules
const express = require("express")
const router = express.Router()
const {auth}  = require("../middleware/Auth")
// Import the required controllers and middleware functions
const {
  logIn,
  signUp,
  otpSend,
  changePassword,
} = require("../controller/auth")
const {
  forgetPassword,
  resetPassword,
} = require("../controller/ResetPassword")



// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login",logIn)

// Route for user signup
router.post("/signup",signUp)

// Route for sending OTP to the user's email
router.post("/sendotp",otpSend)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", forgetPassword)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router