const express = require('express')

const router = express.Router()
const upload = require('../config/multer')

// Upload Image
router.post('/', upload.single("image"), (req, res) => {
      if (!req.file) return res.status(400).json("Image required")
      res.json(req.file.filename)
})

module.exports = router