const multer = require('multer')
const path = require('path')
const ExpressError =  require("../utils/ErrorHandler")

const storage = multer.diskStorage({
      destination: function(req, file, cb) {
            cb(null, "upload/images")
      },
      filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
      }
})

const upload = multer({
      storage: storage,
      fileFilter: function(req, file, cb) {
            if (file.mimetype.startsWith('image/')) {
                  cb(null, true)
            } else {
                  cb(new ExpressError(400, "File must image"), false)
            }
      }
})

module.exports = upload