const { userSignup, userLogin } = require('../controllers/user')

const router = require('express').Router()

router.post('/signup', userSignup)
router.post('/login', userLogin)

module.exports = router