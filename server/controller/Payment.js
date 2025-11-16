const mongoose = require("mongoose");
const {instance} = require("../config/razorpay");
// require Course with correct case (filesystem is case-sensitive)
const Course = require("../model/Course");
const user = require("../model/User");
const mailSender = require("../utilis/mailSender");
const crypto = require("crypto");

// for multiple item payment

exports.captureMultiplePayment = async(req,res)=>{
    try{
      // 1. Validation for courses & user
      const {courses} = req.body;
      const userId = req.User?.id;
      
      console.log("captureMultiplePayment - Received courses:", JSON.stringify(courses, null, 2));
      console.log("captureMultiplePayment - User ID:", userId);
      
      if(!courses || !Array.isArray(courses) || courses.length === 0){
        return res.status(400).json({
            success: false,
            message: "Please provide valid courses array"
        });
      }
      
      if(!userId){
        return res.status(400).json({
            success: false,
            message: "Please provide valid User Id"
        });
      }
      
      // 2. Validate all courses exist and calculate total amount
      const uid = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId);
      let totalAmount = 0;
      const courseIds = [];
      
      for(const courseItem of courses){
        // Extract course ID - handle different formats
        let courseId = null;
        if(typeof courseItem === 'string'){
          courseId = courseItem;
        } else if(courseItem._id){
          courseId = courseItem._id;
        } else if(courseItem.courseId){
          courseId = courseItem.courseId;
        } else if(courseItem.id){
          courseId = courseItem.id;
        }
        
        if(!courseId){
          return res.status(400).json({
              success: false,
              message: "Invalid course data format. Course ID is missing."
          });
        }
        
        // Convert to string for consistency
        courseId = courseId.toString();
        courseIds.push(courseId);
        
        console.log("Looking up course with ID:", courseId);
        const course = await Course.findById(courseId);
        if(!course){
          return res.status(400).json({
              success: false,
              message: `Course with ID ${courseId} not found`
          });
        }
        
        // 3. Validation for enrolled course (check if already enrolled)
        // Convert ObjectIds to strings for comparison
        const enrolledIds = course.studentsEnrolled 
          ? course.studentsEnrolled.map(id => id.toString())
          : [];
        const userIdStr = uid.toString();
        
        if(enrolledIds.includes(userIdStr)){
          return res.status(400).json({
              success: false,
              message: `Student is already enrolled in course: ${course.courseName}`
          });
        }
        
        totalAmount += course.price || 0;
      }
      
      if(totalAmount <= 0){
        return res.status(400).json({
            success: false,
            message: "Invalid course prices. Total amount must be greater than 0"
        });
      }
      
      // 4. Create Razorpay order
      // Check if Razorpay is configured
      if(!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET){
        console.error("Razorpay keys missing in environment variables");
        return res.status(500).json({
          success: false,
          message: "Payment gateway is not configured. Please contact administrator."
        });
      }
      
      // Check if instance is properly initialized
      if(!instance){
        console.error("Razorpay instance is null - keys may be invalid or missing");
        return res.status(500).json({
          success: false,
          message: "Payment gateway is not properly configured. Please check Razorpay keys in environment variables."
        });
      }
      
      const options = {
        amount: Math.round(totalAmount * 100), // Ensure it's an integer
        currency: "INR",
        receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notes: {
          courses: courseIds.join(","),
          userId: userId.toString()
        }
      };
      
      console.log("Creating Razorpay order with options:", {
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        notes: options.notes
      });
      
      let order;
      try {
        order = await instance.orders.create(options);
        console.log("Razorpay order created:", order.id);
      } catch (razorpayError) {
        console.error("Razorpay API Error:", razorpayError);
        console.error("Razorpay Error Details:", {
          message: razorpayError.message,
          statusCode: razorpayError.statusCode,
          error: razorpayError.error
        });
        
        // Handle authentication errors specifically
        if(razorpayError.statusCode === 401 || razorpayError.error?.code === 'BAD_REQUEST_ERROR'){
          return res.status(500).json({
            success: false,
            message: "Payment gateway authentication failed. Please check Razorpay configuration.",
            error: process.env.NODE_ENV === "development" ? {
              code: razorpayError.error?.code,
              description: razorpayError.error?.description
            } : undefined
          });
        }
        
        return res.status(500).json({
          success: false,
          message: razorpayError.error?.description || razorpayError.message || "Failed to create payment order",
          error: process.env.NODE_ENV === "development" ? razorpayError.error : undefined
        });
      }
      
      return res.status(200).json({
        success: true,
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
        courses: courseIds,
        totalAmount: totalAmount
      });

    }catch(error){
        console.log("captureMultiplePayment ERROR:", error);
        console.log("Error stack:", error.stack);
        console.log("Error details:", {
            message: error.message,
            name: error.name,
            response: error.response?.data
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create payment order",
            error: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
}

// these functions are For Single item payment
// capture the payment  and initiate the razorpay order
// exports.capturePayment = async(req,res)=>{
//     // get courseid
//     const {courseid}=req.body;
//      // valid courseId
//      const userId = req.body.id
//     // validation 
//     if(!courseid){
//         return res.status(400).json({
//             success:false,
//             message:"Please Provide Valid Course id"
//         })
//     }
    
   
//     // valid couseDetail
//     let course;  
//     try{ 
//    course = await  Course.findById(courseid);
//    if(!course){
//     return res.status(400).json({
//         success:false,
//         message:"Please Provide Valid Course"
//     })
// }
// // user already pay for same  course 
// const uid = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId)
// if(course.studentsEnrolled.includes(uid)){
//     return res.status(500).json({
//         success:false,
//         message:"Student is enrolled"
//     });
// }

//     }catch(error){
//         console.log(error);
//         return res.status(403).json({
//             success:true,
//             message:error.message,
//         })
//     }
//     // order create
//     const amount = course.price;
//     const currency = "INR";
//     const option = {
//         amount : amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         notes:{
//             courseid:courseid,
//             userId
//         }

//     };
//     try{
//         // initiate the payment using razorpay
//    const paymentResponse = await instance.orders.create(option);
//    console.log(paymentResponse);
//     // return response 
//     return res.status(200).json({
//         success:true,
//         courseName:course.courseName,
//         courseDescription:course.courseDescription,
//         thumnails:course.thumbnails,
//         orderId:paymentResponse.id,
//         currency:paymentResponse.currency,
//         amount:paymentResponse.amount
//     })
//     }catch(error){
//      console.log(error);
//      return res.status(403).json({
//         success:false,
//         message:"could not initiate the order"
//      })
//     }
   
// }


// Verify payment using client-provided signature and enroll user
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body || {};
    const userId = req.User?.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing razorpay verification fields",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user",
      });
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid courses data",
      });
    }

    // Verify signature: HMAC_SHA256(order_id|payment_id, RAZORPAY_SECRET)
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(401).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Enroll the user in the courses
    const uid = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId);
    const enrolledCourseIds = [];

    for (const courseItem of courses) {
      let courseId = null;
      if (typeof courseItem === "string") courseId = courseItem;
      else if (courseItem?._id) courseId = courseItem._id;
      else if (courseItem?.courseId) courseId = courseItem.courseId;
      else if (courseItem?.id) courseId = courseItem.id;

      if (!courseId) {
        return res.status(400).json({
          success: false,
          message: "Invalid course data format. Course ID is missing.",
        });
      }

      courseId = courseId.toString();
      const found = await Course.findById(courseId);
      if (!found) {
        return res.status(400).json({
          success: false,
          message: `Course with ID ${courseId} not found`,
        });
      }

      const already = (found.studentsEnrolled || []).map((id) => id.toString()).includes(uid.toString());
      if (!already) {
        await Course.findByIdAndUpdate(courseId, { $push: { studentsEnrolled: uid } });
        await user.findByIdAndUpdate(uid, { $push: { courses: courseId } });
        enrolledCourseIds.push(courseId);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and enrollment completed",
      enrolled: enrolledCourseIds,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

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
    {$push:{ courses:courseid}},
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

exports.EnrlledCourseDetails = async(req,res)=>{
    try{
        // 1. Validation for course & user
        const {courseId} = req.body;
        const userId = req.User?.id;
        
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Please provide valid Course Id"
            });
        }
        
        if(!userId){
            return res.status(400).json({
                success: false,
                message: "Please provide valid User Id"
            });
        }
        
        // 2. Traverse on the course & find the course & enroll the student in it
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(400).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // 3. Validation for enrolled course (check if already enrolled)
        const uid = userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled && Array.isArray(course.studentsEnrolled) && course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled in this course"
            });
        }
        
        // Enroll the student in the course
        const enrolledCourse = await Course.findByIdAndUpdate(
            courseId,
            {$push: {studentsEnrolled: uid}},
            {new: true}
        );
        
        if(!enrolledCourse){
            return res.status(400).json({
                success: false,
                message: "Failed to enroll in course"
            });
        }
        
        // 4. Find the user & add the course to their list of enrolled Courses
        const courseObjectId = courseId instanceof mongoose.Types.ObjectId ? courseId : new mongoose.Types.ObjectId(courseId);
        const enrolledStudent = await user.findByIdAndUpdate(
            userId,
            {$push: {courses: courseObjectId}},
            {new: true}
        );
        
        if(!enrolledStudent){
            return res.status(400).json({
                success: false,
                message: "Failed to update student courses"
            });
        }
        
        // 5. Send the email to the student
        const emailResponse = await mailSender(
            enrolledStudent.email,
            "Course Enrollment Successful",
            `Dear ${enrolledStudent.firstName || 'Student'},
            
Congratulations! You have successfully enrolled in the course: ${course.courseName}.

You can now access the course content by logging into your account.

Happy Learning!
EduConnect Team`
        );
        
        console.log("Email sent:", emailResponse);
        
        return res.status(200).json({
            success: true,
            message: "Student enrolled successfully in the course",
            course: {
                courseId: course._id,
                courseName: course.courseName
            },
            student: {
                userId: enrolledStudent._id,
                email: enrolledStudent.email
            }
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to enroll student in course"
        });
    }
}