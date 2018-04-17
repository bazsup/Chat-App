require('dotenv').config()

const app = require('express')()
const next = require('next')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const bodyParser = require('body-parser')
const cors = require('cors')

const { createProxyServer } = require('http-proxy')
const url = require('url')
const _ = require('lodash')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const routes = require('./routes')

nextApp.prepare().then(() => {
  require('./socket-server')(io)
  const serverAPIProxy = createProxyServer()

  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use('/api', routes)

  app.all('/aaa/*', (req, res) => {
    const __path = _.drop(req.url.split('/'), 2)
    serverAPIProxy.proxyRequest(req, res, {
      target: url.resolve(process.env.URL, __path.join('/')),
      ignorePath: true,
      changeOrigin: true
    })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, async err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
    // console.log('res', resp)
  })

  // require('./socket-server')(io)
  // io.listen(app)
})
