const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { insertUser, getUserByEmail } = require('../database')
const ExpressError = require('../utils/ErrorHandler')
const { v4: uuidv4 } = require('uuid')
const { sendMail } = require('./sendMail')

module.exports.userRegister = async (fullname, username, password, email) => {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)
      const token = uuidv4()
      const result = await insertUser(fullname, username, hashed, email, token)

      // Try to send email, but don't fail if it doesn't work
      try {
            await sendMail(email, "Simpan Kode OTP", `<h1>Kode OTP anda : ${token}</h1>`)
      } catch (error) {
            console.log('Email sending failed (optional):', error.message)
      }

      return result
}

module.exports.userLogin = async (email, password) => {
      const user = await getUserByEmail(email)
      if (!user) throw new ExpressError(404, "Email or Password not valid")
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw new ExpressError(401, "Email or Password not valid")
      const token = jwt.sign({ id: user.user_id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' })
      return { token, passwordHash: user.password }
}