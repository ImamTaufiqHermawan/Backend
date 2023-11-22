const FormData = require("form-data")
const fs = require("fs")
const ImageKit = require("imagekit");
const ApiError = require("../utils/apiError");

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY_IMAGEKIT,
    privateKey: process.env.PRIVATE_KEY_IMAGEKIT,
    urlEndpoint: process.env.URL_ENDPOINT,
});

const uploadImage = async(req, res, next) => {
  if (req.file) {
    const file = req.file;

    await imagekit.upload({
      file : file.buffer,                
      fileName : req.file.originalname,
    }).then(data => {
      req.uploadImage = data
      next()
    }).catch(err => {
        next(new ApiError(err.message));
    })
  } else {
    next()
  }
}

module.exports = uploadImage