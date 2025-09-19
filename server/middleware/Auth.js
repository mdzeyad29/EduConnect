const jwt = require("jsonwebtoken");
const multer = require('multer');
require("dotenv").config();
// auth
exports.auth = async(req,res,next)=>{
    try{
        // extract token from cookies
            console.log("Auth middleware start");
            console.log("Auth middleware start: req path",  req.path);

             console.log("Auth middleware start: req method", req.method);
             console.log("Auth middleware Body: req body", req.body);

             console.log("Incoming Headers:", req.headers);
             console.log("Incoming Cookies:", req.cookies);
             console.log("Incoming Body:", req.body);

       const token = req.cookies.EduConnect || 
               req.body.token ||
               (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));
           console.log("token",token);
          if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Not there"
            })
          }
        // verifying token
        try{
             const decode =jwt.verify(token, process.env.JWT_SECRET);
             req.User=decode;
             console.log("decode is this ",decode);
             console.log("User is this ",req.User)
             console.log(process.env.JWT_SECRET);
        }catch(error){
           console.log(error);
           return res.status(401).json({
            status:false,
            message:"token is invalidss"
           })
        }
        next();
    }catch(error){
          console.log(error)
            return res.status(400).json({
               success:false,
               message:"Auth Verification is failed"    
            })
          
    }
}
// isStudent 
exports.isStudent = async(req,res,next)=>{
  try{
    if(req.User.accountType!=="Student"){
        return res.status(400).json({
            success:false,
            message:"Student is Not allowed"
        })
    }
      next()  ;
  }catch(error){
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"This role  is not for this "
    })
  }
}
// isInstructor
exports.isInstructor= async(req,res,next)=>{
    try{
      console.log("here is user for Instructor",req.User);
      console.log("isInstructor check:", req.User);
        if(req.User.accountType!=="Instructor"){
            return res.status(400).json({
                success:false,
                message:"Only Instructors can create courses"
            })
        }
        next();    
      }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:" Error This role  is  for Instructor "
        })
      }

}
//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
      console.log("here is user",req.User);
      console.log("Account Type",req.User.accountType);
      if (req.User.accountType !== "Admin" && req.User.accountType !== "Instructor") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route only for Admin or Instructor",
            });
        }
        next()    ;
      }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:" Error This role  is  for Admin "
        })
      }

}
