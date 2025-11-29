const jwt = require('jsonwebtoken')

module.exports.authMiddleware = (req, res, next) => {
      try {
            const token = req.cookies.token
            jwt.verify(token, process.env.JWT_SECRET)
            next()
      } catch (error) {
            res.status(403).send("Not authenticated")
      }
}