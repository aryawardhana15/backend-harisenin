const { getMovies, getMovieById, updateMovie, insertMovie, deleteMovie, getMovieByRating, getMoviesSortBy, getMovieByName } = require('../database')


module.exports.index = async (req, res) => {
      const { search, rating, sort } = req.query
      const searching = await getMovieByName(search)
      const sorting = await getMoviesSortBy(sort)
      const filtering = await getMovieByRating(rating)
      const movies = await getMovies()
      res.send(search ? searching : rating ? filtering : sort ? sorting : movies)
}

module.exports.show = async (req, res) => {
      const { id } = req.params
      const movie = await getMovieById(id)
      res.send(movie)
}

module.exports.store = async (req, res) => {
      const { name, synopsis, rating } = req.body
      if (!name || !synopsis || !rating) return res.send("Field cannot Empty")
      const movie = await insertMovie(name, synopsis, rating)
      res.send(movie)
}

module.exports.update = async (req, res) => {
      try {
            const { id } = req.params
            const { name, synopsis, rating } = req.body
            if (!name || !synopsis || !rating) return res.send("Field cannot Empty")
            const movie = await updateMovie(name, synopsis, rating, id)
            res.send(movie)
      } catch (error) {
            console.log(error)
      }
}

module.exports.destroy = (req, res) => {
      const { id } = req.params
      deleteMovie(id)
      res.send("Deleted Movie Successfully")
}