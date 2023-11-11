const { userTest } = require('../controllers/user')

const router = require('express').Router()

router.post('/get', userTest)

module.exports = router