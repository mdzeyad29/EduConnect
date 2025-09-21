const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    if(height) options.height = height;
    if(quality) options.quality = quality;

    options.resource_type = "auto";

    // file.tempFilePath is the actual path for express-fileupload
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
