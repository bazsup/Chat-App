const moment = require('moment')
const axios = require('axios')
const FormData = require('form-data')
const _ = require('lodash')

const api = axios.create({
  baseURL: process.env.API
})

const mapFormData = (fields, data) => {
  const formData = new FormData()
  fields.map((field) => {
    if (data[field]) {
      formData.append(field, data[field])
    }
  })
  return formData
}

module.exports = function (io) {
  io.on('connect', async function (socket) {
    console.log('Connected')
    socket.user = socket.id
    let message = await api.get('/')
    socket.emit('newMsg', {data: message.data.msg})

    socket.on('setUsername', async ({ username }) => {
      let resp = await api.post('/user', { user: username })
      if (resp.data.users) {
        socket.user = username
        socket.emit('userSet', { username })
        io.sockets.emit('setUser', resp.data.users)
      } else {
        socket.emit('userExists', resp.data.message)
      }
    })

    socket.on('msg', async ({ message, user, path }) => {
      const fields = [
        'message',
        'user',
        'preview',
        'time'
      ]
      const prepareData = {
        message: message.trim(),
        user: user,
        time: moment().toISOString(),
        preview: path
      }

      const data = mapFormData(fields, prepareData)
      const config = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`
        }
      }
      const resp = await api.post(`/`, data, config)
      if (resp.data.msg) {
        io.sockets.emit('newMsg', {data: resp.data.msg, user: socket.user})
      }
    })

    socket.on('disconnect', async () => {
      const resp = await api.delete(`/user/${socket.user}`)
      if (resp.data.users) {
        io.sockets.emit('setUser', resp.data.users)
      }
      console.log('Disconnected')
    })
  })
}
