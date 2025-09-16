const User = require("../model/User");
const OTP = require("../model/otp");
const  otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../model/Profile")
require("dotenv").config();
// function for OTP  Send
exports.otpSend =  async(req,res)=>{
    try{
        // extract email
         const {email}= req.body
          // check for existing 
         const checkEmail =await  User.findOne({email});
         console.log("this is emailcheck",checkEmail);
         if(checkEmail){
            return res.status(500).json({
                success:false,
                message:"User Already registered"
            });
         }
       var otp =   otpGenerator.generate(6,{
          upperCaseAlphabets:false,
          lowerCaseAlphabets:false,
          specialChars:false
       })

       console.log("otp is generate  this is the otp",otp)
       // check unique otp or not 
       let existingOTP = await OTP.findOne({ otp });
       while (existingOTP) {
           // Regenerate OTP if it already exists
           otp = otpGenerator.generate(6, {
               upperCaseAlphabets: false,
               lowerCaseAlphabets: false,
               specialChars: false
           });
           existingOTP = await OTP.findOne({ otp });
       }
         console.log(existingOTP)
       

       
       // Create a new entry in the OTP collection
       const otpPayload = { email, otp };
       const otpBody = await OTP.create(otpPayload);
       console.log("Stored OTP:", otpBody);

         res.status(200).json({
            success:true,
            message:"OTP send Successfully",
            otp
         })

    }catch(error){
        console.log(error)
        return res.status(501).json({
            success:false,
            message:error.message
        });
    }
}

exports.signUp = async (req, res) => {
	try {
		// Destructure fields from the request body with corrected field names
		const {
			firstName,
			lastName,
			email,
			password,
			confirmpassword,
			accountType,
			contactnumber,
			otp,
		} = req.body;
console.log("Received signup body:", req.body);
		// Check if all required fields are provided
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmpassword ||
			!otp
		) {
			return res.status(400).json({
				success: false,
				message: "All Fields are required",
			});
		}

		// Check if password and confirm password match
		if (password !== confirmpassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match. Please try again.",
			});
		}

		// Check if the user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please sign in to continue.",
			});
		}

		// Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Determine if the account should be approved based on the account type
		const approved = accountType === "Instructor" ? false : true;

		// Create the additional profile for the user
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: contactnumber || null,  // Use contactNumber if provided
		});

		// Create the user
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber: contactnumber,
			password: hashedPassword,
			accountType: accountType,
			approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
		});
		// Respond with success
		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("Error during user registration:", error);
		return res.status(500).json({
			success: false,
			message: "User cannot be registered. Please try again.",
		});
	}
};

// functon for LogIN
exports.logIn = async(req,res)=>{
    try{
        // fetch dataclear
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"please fill full detail" 
            })
        }
     // check the email in database
        const user = await User.findOne({email}).populate("additionalDetails").lean();
        if(!user){
            return res.status(400).json({
             success:false,
             message:"User is Not Registered"    
            })
        }

        //  verify password and then create jwt 
        let payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
        }
        if( await bcrypt.compare(password,user.password)){
            // if password is matched
           // generate token
     let token = jwt.sign(payload,process.env.JWT_SECRET,{
          expiresIn:"44h"
     });
	
     user.token=token;
	 console.log("here is the token for login forn and send ", token)
     await User.findByIdAndUpdate(user._id, { token: token });
     user.password=undefined;
     const option = {
        expires: new Date(Date.now()+3*24*60*60*1000),
        httpOnly:true
     }
     res.cookie("EduConnect",token,option).status(200).json({
        success:true,
        message:"User logged Successfully",
        token,
        user
     })
        }else{
            // password doesn't match
            return res.status(400).json({
                success:false,
                message:"password id Incorrect"
            })
        }


    }catch(error){
  console.log(error);
  return res.status(400).json({
      success:false,
      message:"Error while Login"
  })
    }
}

// change Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
