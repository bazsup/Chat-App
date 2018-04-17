const { upload } = require('../middlewares/multipartFormData')
const MessageController = require('./controller')
const Router = require('express').Router
const router = Router()

router.get('/', MessageController.getAllMessage)
router.post('/', upload.single('pict'), MessageController.addMessage)

router.post('/upload', upload.single('pict'), function (req, res) {
  if (req.file) {
    res.send({
      path: '/static/files/' + req.file.filename
    })
  } else {
    res.send({
      message: 'no file found!'
    })
  }
})

router.get('/user', MessageController.getAllUser)
router.post('/user', MessageController.addUser)
router.delete('/user/:user', MessageController.removeUser)

module.exports = router
