const transporter = require("../config/nodemailer")
const ExpressError = require("../utils/ErrorHandler")

module.exports.sendMail = async (to, subject, html) => {
      try {
            await transporter.sendMail({
                  from: process.env.EMAIL_USER,
                  to,
                  subject,
                  html
            })
      } catch (error) {
            throw new ExpressError(400, error.message)
      }
}