const express = require('express');
const router = express.Router();

const fileUploader = require('../config/upload-setup/cloudinary');

// note: this is not the router for the frontend, just the backend when we use axios for instance. 
router.post('/upload-file', fileUploader.array('submittedFile', 3), (req, res, next) => {

  // when testing in Postman, make sure to put for "key" the name of the 
  // parameter above 'submittedFile' since the function requires parameters to work.
    if (!req.files){
      next(new Error('No file uploaded!'));
      return;
    }

    if (req.files.length > 4){
      next(new Error('You can upload only 3 images!'));
      return;
    }

    const files = [];
    req.files.forEach(oneFile => {
      const { originalname, secure_url, format, width, height } = oneFile;

      let singleFile = {
        fileName: originalname,
        fileUrl: secure_url,
        format,
        width,
        height
      }
      files.push(singleFile)
    })

    res.json(files);
})




module.exports = router;
