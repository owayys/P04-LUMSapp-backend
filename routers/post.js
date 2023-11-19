const { postCreate, postDelete, postGet, postFeed } = require('../controllers/post')
const authenticateJWT = require('../middleware/auth')

const router = require('express').Router()

router.get('/get', authenticateJWT, postGet)
router.get('/feed', authenticateJWT, postFeed)
router.post('/create', authenticateJWT, postCreate)
router.post('/delete', authenticateJWT, postDelete)

module.exports = router