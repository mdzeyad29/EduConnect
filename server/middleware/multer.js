const express = require('express')
const multer  = require('multer')
// temporary disk storage
const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, 'public/uploads')
    },
   filename: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now())
   }
});

const upload = multer({ storage: storage });

module.exports = upload;