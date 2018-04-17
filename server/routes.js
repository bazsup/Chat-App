const Router = require('express').Router
const router = Router()

const MessageRoute = require('./message/routes')

router.use('/message', MessageRoute)

module.exports = router
