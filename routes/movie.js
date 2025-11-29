const express = require('express')
const MovieController = require('../controllers/movie')
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', MovieController.index)

router.get("/:id", authMiddleware, MovieController.show)

router.post('/', authMiddleware, MovieController.store)

router.patch('/:id', authMiddleware, MovieController.update)

router.delete('/:id', authMiddleware, MovieController.destroy)

module.exports = router