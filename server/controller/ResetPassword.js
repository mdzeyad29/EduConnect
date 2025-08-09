const User = require("../model/User");
const mailSender = require("../utilis/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Forget Password
exports.forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;

    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString("hex");
    console.log(token);

    // Update user with reset token and expiration
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
      },
      { new: true }
    );
    console.log("DETAILS", updatedDetails);

    // Create URL for password reset
    const url = `http://localhost:5173/update-password/${token}`;

    // Send email with the password reset link
    await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in forget password process",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Find user by reset token
    const userDetail = await User.findOne({ token: token });

    // Check if the token is valid
    if (!userDetail) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Check if token is expired
    if (userDetail.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired, please regenerate",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear the token
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashPassword,
        token: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in resetting password",
    });
  }
};
