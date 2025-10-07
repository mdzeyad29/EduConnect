const mongoose = require("mongoose");
const {instance} = require("../config/razorpay");
// require Course with correct case (filesystem is case-sensitive)
const Course = require("../model/Course");
const user = require("../model/User");
const mailSender = require("../utilis/mailSender");
const crypto = require("crypto");

// capture the payment  and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
    // get courseid
    const {courseid}=req.body;
     // valid courseId
     const userId = req.body.id
    // validation 
    if(!courseid){
        return res.status(400).json({
            success:false,
            message:"Please Provide Valid Course id"
        })
    }
    
   
    // valid couseDetail
    let course;  
    try{ 
   course = await  Course.findById(courseid);
   if(!course){
    return res.status(400).json({
        success:false,
        message:"Please Provide Valid Course"
    })
}
// user already pay for same  course 
const uid = new mongoose.Types.ObjectId(userId)
if(course.studentsEnrolled.includes(uid)){
    return res.status(500).json({
        success:false,
        message:"Student is enrolled"
    });
}

    }catch(error){
        console.log(error);
        return res.status(403).json({
            success:true,
            message:error.message,
        })
    }
    // order create
    const amount = course.price;
    const currency = "INR";
    const option = {
        amount : amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseid:courseid,
            userId
        }

    };
    try{
        // initiate the payment using razorpay
   const paymentResponse = await instance.orders.create(option);
   console.log(paymentResponse);
    // return response 
    return res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumnails:course.thumbnails,
        orderId:paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount
    })
    }catch(error){
     console.log(error);
     return res.status(403).json({
        success:false,
        message:"could not initiate the order"
     })
    }
   
}
// verify Signature of Razorpay and Server
exports.verifySignature = async(req,res)=>{
 const webhookSecret = "123456" ;
 const sign = req.headers["x-razorpay-signature"];

 // convert into hash format 
  const shasum = crypto.createHmac("sha256",webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  //match sign and converted format
  if(sign===digest){
   console.log("payment is Authorised");
   const {courseid,userId} = req.body.payload.payment.entity.notes;
   try{
    // fullfill the action
     //find the course  and enroll in it  
    const enrolledCourse = await Course.findOneAndUpdate(
        {_id:courseid},
        {$push:{studentsEnrolled:userId}},
        {new:true}

    );
     if(!enrolledCourse){
         return res.status(401).json({
          success:false,
          message:"course not found",
         })
     }
   console.log(enrolledCourse);
   // find the course and update in student id 
   const enrolledStudent = await user.findOneAndUpdate(
    {_id:userId},
    {$push:{ Courses:courseid}},
    {new:true},
   )
   console.log(enrolledStudent) ;
// send the mail to the student 
const emailresponse = await mailSender(
    enrolledStudent.email,
    "Congrats, you got a course"
);
console.log(emailresponse);
return res.status(200).json({
    success:true,
    message:"Successfull the course payment"
})

   }catch(error){
  return res.status(401).json({
    success:false,
    message:error.message 
  })
   }
  }else{
    return res.status(401).json({
        success:false,
        message:"Invalid request",
    })
  }
}
