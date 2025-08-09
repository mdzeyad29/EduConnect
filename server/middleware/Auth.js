const jwt = require("jsonwebtoken");
const User = require("../model/User");
const multer = require('multer');
require("dotenv").config();
// auth
exports.auth = async(req,res,next)=>{
    try{
        // extract token from cookie
        const token = req.cookies.EduConnect || 
        req.body.token ||
         (req.headers.authorization && req.headers.authorization.replace("Bearer ", ""));
            
          if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Not there"
            })
          }
        // verifying token
        try{
             const decode =jwt.verify(token, process.env.JWT_SECERT);
             req.User=decode;
             console.log(process.env.JWT_SECERT);
        }catch(error){
           console.log(error);
           return res.status(401).json({
            status:false,
            message:"token is invalid"
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
    if(req.user.accounttype!=="Student"){
        return res.status(400).json({
            success:false,
            message:"Student is Not allowed"
        })
    }
        
  }catch(error){
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"This role  is not for this "
    })
  }
}
//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accounttype!=="Admin"){
            return res.status(400).json({
                success:false,
                message:"Admin is Not allowed"
            })
        }
            
      }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:" Error This role  is  for Admin "
        })
      }

}
// isInstructor
exports.isInstructor= async(req,res,next)=>{
    try{
        if(req.user.accounttype!=="Admin"){
            return res.status(400).json({
                success:false,
                message:"Instructor is Not allowed"
            })
        }
            
      }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:" Error This role  is  for Instructor "
        })
      }

}