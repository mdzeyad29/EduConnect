const { v2: cloudinary } = require("cloudinary");
const cloudinaryConnect = ()=>{
try{
	cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
}catch(error){
	console.log("Something error inside the cloudinaryConnect",error)
}
}


module.exports = { cloudinary, cloudinaryConnect };
