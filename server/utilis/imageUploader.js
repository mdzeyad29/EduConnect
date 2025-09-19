const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


exports.uploadImageTocloudinary = async (file, folder) => {
  try {
    const options = { folder };
    options.resource_type = "auto"; // handles jpg, png, gif, pdf, etc.
    const result = await cloudinary.uploader.upload(file, options);
    return result.secure_url; // only return URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed");
  }
   return await cloudinary.uploader.upload(file.tempFilePath, options);
};