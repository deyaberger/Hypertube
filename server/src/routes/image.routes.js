const multer 	= require("multer");
const express 	= require("express");
const storage = multer.memoryStorage();

const upload = multer({
  dest: "./uploads",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"||
      file.mimetype == "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"));
    }
  },
  limits: {
	fileSize: 8000000
  }
}).single('file')

function upload_func(req, res, next) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log("<image.routes> MULTER_ERROR: ", err.code)
			return res.status(400).send({code: "MULTER_ERROR", message: err.message})
		}
		else if (err && err.message == "Only .png, .jpg, .jpeg and .webp format allowed!") {
            console.log("err type images")
			console.log("<image.routes> FILE_TYPE_ERROR: ", err.message)
			return res.status(201).send({code: "FILE_TYPE_ERROR", message: err.message})
		}
		else if (err) {
			console.log("<image.routes> UPLOAD_ERROR: ", err.message)
			return res.status(201).send({code: "UPLOAD_ERROR", message: err.message})
		}
		next()
	})
}

module.exports = (db_pool) => {
    const image_controller = require("../controllers/image.controller")(db_pool)
    const auth_middlewares = require("../middlewares/auth.middleware")

    var router = require("express").Router();

    router.use  ('/get'    , express.static                   ('./uploads' )                              );
    router.post ("/upload" , auth_middlewares.authenticateToken, upload_func, image_controller.upload_image);

    return router
}


