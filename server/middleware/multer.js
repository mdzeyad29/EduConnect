const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (optional, e.g. only images and videos)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/webm" ||
    file.mimetype === "video/avi"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG/PNG/MP4/WebM/AVI allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
