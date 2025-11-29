const express = require('express')
const { getUserToken } = require('../database')

const router = express.Router()

// Verify Token OTP
router.get('/verify-email/:token', async (req, res) => {
      const { token } = req.params
      const tokenDatabase = await getUserToken(token)
      if (!tokenDatabase) return res.status(404).send("Invalid Verification Token")
      res.send({ "Token-OTP": tokenDatabase.token, message: "Email Verified Successfully" })
})

module.exports = router