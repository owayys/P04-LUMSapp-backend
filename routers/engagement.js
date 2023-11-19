const { engagementReact } = require('../controllers/engagement')
const authenticateJWT = require('../middleware/auth')

const router = require('express').Router()

router.post('/react', authenticateJWT, engagementReact)

module.exports = router 