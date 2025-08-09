const mongoose = require("mongoose");
const mailSender = require("../utilis/mailSender");
// otp Schema
const otpSchema = new mongoose.Schema({
    email:{
  type:String,
  required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
    }

})
// function to Send Mail
async function sendVerificationEmail(email,otp){
try{
const mailResponse = await mailSender(email,"Verfication Email From EduConnecct",otp)
 console.log("Email Send SuccessFully",mailResponse);
}catch(error){
 console.log("Error In MailResponse",error);
}
}
// otp function
otpSchema.pre('save',async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})
module.exports = mongoose.model("OTP",otpSchema)