const { postCreate, postDelete, postGet, postFeed } = require('../controllers/post')

const router = require('express').Router()

router.get('/get', postGet)
router.get('/feed', postFeed)
router.post('/create', postCreate)
router.post('/delete', postDelete)

module.exports = router