const Section = require("../model/section");
const Course = require("../model/course");

exports.createSectionCourse = async(req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId} = req.body;
        // data validation
        if(!sectionName|| ! courseId){
            return res.status(400).json({
              success:false,
              message:"There is no data"
            })
        }
        // create section
        const newSection =  await Section.create({sectionName});
        // update course with objectID
 const updateDetail = await Course.findByIdAndUpdate(
    courseId,
    {
        $push:{
          courseContent:newSection._id,   
        }
    },
    {new:true}
 );
 //    HW ::use populate to replace section and sub section both in updated course 
        // return response
        return res.status(200).json({
           success:true,
            message:"Course SuccessFully created",
            updateDetail
        })

    }catch(error){
           console.log(error) ;
           return res.status(400).json({
                     success:false,
                     message:"Error in Created Section",
                     error:error.message
           })
    }
}

exports.upDateCourse = async(req,res)=>{
    try{
        // data fetch
        const {sectionName,sectionId} = req.body;
        // data validation
        if(!sectionName|| ! sectionId){
            return res.status(400).json({
              success:false,
              message:"There is no data"
            })
        }
        // update data
        const section = await Section.findByIdAndUpdate( sectionId,{sectionName},{new:true});
    
        // return response
        return res.status(200).json({
            success:true,
            message:"SuccessFully Update The Course Section"
          })
    }catch(error){
        console.log(error);
        return  res.status(500).json({
            success:false,
            message:"Error in  Update The Course Section"
        })
    }
}

exports.deleteSection = async(req,res)=>{
   try{
     // get id  : : assuming that we are sending a id in params
  const {sectionId} = req.paramas;
     // find by id and delete
     const deleteSection = await Section.findByIdAndDelete({sectionId});
     // return response
     return res.status(200).json({
        success:true,
        message:"Course are Deleted Successfully"
     })
   }catch(error){
    console.log(error);
    return res.status(500).json({
    success:false,
    message:"Unable to delete,please try again"    
    })
   }
}