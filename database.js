const mysql = require('mysql2')
const ExpressError = require('./utils/ErrorHandler')

const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
}).promise()

module.exports.getMovies = async () => {
      const [res] = await pool.query("SELECT * FROM movies")
      return res
}

module.exports.getMovieById = async (id) => {
      const [res] = await pool.query("SELECT * FROM movies WHERE id = ?", [id])
      return res[0]
}

module.exports.getMovieByName = async (name) => {
      const keyword = `%${name}%`
      const [res] = await pool.query("SELECT * FROM movies WHERE name LIKE ?", [keyword])
      return res
}

module.exports.getMovieByRating = async (rating) => {
      const [res] = await pool.query("SELECT * FROM movies WHERE rating >= ?", [rating])
      return res
}

module.exports.getMoviesSortBy = async (sort) => {
      if (!sort) return
      const allowed = ["name", 'synopsis', 'rating']
      const [sortBy, order] = sort.split('_')
      if (!allowed.includes(sortBy)) return new ExpressError(400, "Invalid sort")
      const isDesc = order === "desc" ? "DESC" : "ASC"
      const [res] = await pool.query(`SELECT * FROM movies ORDER BY ${sortBy} ${isDesc}`)
      return res
}

module.exports.insertMovie = async (name, synopsis, rating) => {
      const result = await pool.query("INSERT INTO movies (name, synopsis, rating) VALUES (?, ?, ?)", [name, synopsis, rating])
      return { id: result[0].insertId, name, synopsis, rating }
}

module.exports.updateMovie = async (name, synopsis, rating, id) => {
      await pool.query("UPDATE movies SET name = ?, synopsis = ?, rating = ? WHERE id = ?", [name, synopsis, rating, id])
      return { id, name, synopsis, rating }
}

module.exports.deleteMovie = async (id) => {
      await pool.query("DELETE FROM movies WHERE id = ?", [id])
}

module.exports.getUsers = async () => {
      const [res] = await pool.query("SELECT * FROM users")
      return res
}

module.exports.getUserByEmail = async (email) => {
      const result = await pool.query("SELECT * FROM users WHERE email = ?", [email])
      return result[0][0]
}

module.exports.insertUser = async (fullname, username, password, email, token) => {
      const result = await pool.query("INSERT INTO users (fullname, username, password, email, token) VALUES (?, ?, ?, ?, ?)", [fullname, username, password, email, token])
      return { user_id: result[0].insertId, fullname, username, password, email, token }
}

module.exports.getUserToken = async (token) => {
      const [res] = await pool.query("SELECT * FROM users WHERE token = ?", [token])
      return res[0]
}