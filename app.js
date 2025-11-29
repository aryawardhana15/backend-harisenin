require('dotenv').config()
const cookieParser = require('cookie-parser')
const express = require('express')
const cors = require('cors')
const app = express()

// Configure CORS to allow React dev server
app.use(cors({
      origin: 'http://localhost:5173', // React dev server
      credentials: true // Allow cookies
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json()) // Enable JSON body parsing
app.use(cookieParser())
app.use(express.static('public')) // Serve frontend files

app.use('/movie', require('./routes/movie'))

app.use('/', require('./routes/auth'))

app.use('/upload', require('./routes/upload'))

app.use('/', require('./routes/verified'))

app.use((req, res, next) => {
      next(res.status(404).send("Not Found"))
})

app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500
      res.status(statusCode).send(err.message)
})

app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
})