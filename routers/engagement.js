const { engagementReact } = require('../controllers/engagement')

const router = require('express').Router()

router.post('/react', engagementReact)

module.exports = router 