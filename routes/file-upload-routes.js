const express = require('express');
const router = express.Router();

const fileUploader = require('../config/upload-setup/cloudinary');

// note: this is not the router for the frontend, just the backend when we use axios for instance. 
router.post('/upload-file', fileUploader.single('submittedFile'), (req, res, next) => {
  // when testing in Postman, make sure to put for "key" the name of the 
  // parameter above 'submittedFile' since the function requires parameters to work.
    if (!req.file){
      next(new Error('No file uploaded!'));
      return;
    }
    const { originalname, secure_url, format, width, height } = req.file;

    res.json({
      fileName: originalname,
      fileUrl: secure_url,
      format,
      width,
      height
    })
})

module.exports = router;
