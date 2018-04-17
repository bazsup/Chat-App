const model = require('./model')
const _ = require('lodash')

module.exports = {
  getAllMessage: (req, res) => {
    res.send({
      msg: model.message
    })
  },
  addMessage: (req, res) => {
    try {
      if (req.body) {
        let message = { ...req.body, id: ++model.runningid }
        if (!req.body.preview && !_.isNil(req.file)) {
          message = {
            ...message,
            preview: '/static/files/' + req.file.filename
          }
        }
        model.message.push(message)
        res.status(200).send({
          message: 'added!',
          msg: model.message
        })
      } else {
        res.send({ message: 'add message failed!' })
      }
    } catch (err) {
      res.status(500).send({ message: 'add message failed!' })
    }
  },
  getAllUser: (req, res) => {
    res.send({
      users: model.users
    })
  },
  addUser: (req, res) => {
    try {
      const user = req.body.user
      if (user) {
        let index = _.findIndex(model.users, u => u === user)
        if (index > -1) {
          res.send({
            success: false,
            message: `${user} มีผู้ใช้ชื่อนี้แล้ว`
          })
        } else if (user.length > 30) {
          res.send({
            success: false,
            message: `${user}ยาวเกิน 30 ตัวอักษร`
          })
        } else {
          model.users.push(user)
          res.send({
            success: true,
            users: model.users
          })
        }
      } else {
        res.status(500).send({
          success: false,
          message: `โปรดกรอกชื่อ`
        })
      }
    } catch (err) {
      res.status(500).send({
        message: 'fail to add new user'
      })
    }
  },
  removeUser: (req, res) => {
    let user = req.params.user
    try {
      if (user) {
        _.remove(model.users, (u) => u === user)
        res.send({
          message: 'remove user success',
          users: model.users
        })
      } else {
        res.send({
          message: 'user not found!'
        })
      }
    } catch (err) {
      res.status(500).send({
        message: 'fail to remove user',
        users: model.users
      })
    }
  }
}
