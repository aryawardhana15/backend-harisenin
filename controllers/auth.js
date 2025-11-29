const { userRegister, userLogin } = require('../services/auth')

module.exports.register = async (req, res) => {
      const { fullname, username, password, email } = req.body
      if (!fullname || !username || !password || !email) return res.send("Please input fields")
      const input = await userRegister(fullname, username, password, email)
      res.send(input)
}

module.exports.login = async (req, res) => {
      const { email, password } = req.body
      if (!email || !password) return res.send("Please input fields")
      const { token, passwordHash } = await userLogin(email, password)
      res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
      })
      res.send({ token, email, passwordHash })
}