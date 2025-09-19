const express = require('express')
const multer  = require('multer')
// temporary disk storage
const storage = multer.diskStorage({});

const upload = multer({
  dest:"sites/",
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

module.exports = upload;