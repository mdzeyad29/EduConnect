const Profile = require("../model/Profile");
const User = require("../model/User");
const Course = require("../model/Course");
const {uploadImageToCloudinary} = require("../utilis/imageUploader")
//updateProfile
exports.ProfileController = async(req,res)=>{
    try{
        //get data
         const {DateOfBirth="",about="",contactNumber,gender}= req.body
         console.log("Request Body:", req.body);
        // get userid
        const userid = req.User.id;
        
        // find Profile
        const userDetail = await User.findById(userid);
        console.log("here is user detail",userDetail);
        const profile = await Profile.findById(userDetail.additionalDetails);

        
       // Update profile fields
      
        profile.DateOfBirth = DateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender=gender;
    console.log("about is ",contactNumber);
         //save the updated profile
         await profile.save();
        // return response
   return res.status(200).json({
    success:true,
    message:"Succesfully update the Profile",
    profile,
   })
    }catch(error){
        console.log(error);
       return res.status(200).json({
        success:false,
        message:"Error in Profile"
       })
    }
}
exports.deleteProfile = async(req,res)=>{
    // explore-> how can shecdule the deletion corn job
    try{
    //get id
    const id = req.user.id;
    // validation
    const userDetail = await User.findById(id);
    if(!userDetail){
        return res.status(404).json({
            success:false,
            message:"Id is not there"
        })
    }
    // delete profile
  await Profile.findByIdAndDelete({_id:userDetail.additionalDetails})
    //delete user
    await User.findByIdAndDelete({_id:id});
    // todo:hW unroll user from all enrolled courses
    // return response
    return res.status(200).json({
        success:true,
        message:"delete Successfully"
    })
    }catch(error){
  console.log(error);
  return res.status(401).json({
       success:true,
       message:error.message
  })
    }
}
exports.getAllUserDetail = async(req,res)=>{
   try{
  // get id 
  const id = req.User.id;
  // db se detail lena 
  
   additionalDetails:{
    const userdetail = await User.findById(id).populate("additionalDetails").exec();
  //validation
  if(!userdetail){
    return res.status(401).json({
        success:true,
        message:"there  is no user detail"
    })
  }
  // return response
  return res.status(200).json({
    success:true,
    message:"Successfully get User Detail",
    userdetail
  })
   }
   }catch(error) {
    console.log(error);
  return res.status(401).json({
       success:true,
       message:error.message
  })
   }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    console.log(displayPicture);
    const userId = req.user.id
    console.log(userId);
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.User.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};
