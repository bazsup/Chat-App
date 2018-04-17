const multer = require('multer')
const moment = require('moment')
const path = require('path')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../static/files'),
  filename: function (req, file, cb) {
    cb(null, `${moment().format('x')}-${file.originalname}`)
    // file.fieldname
  }
})

const upload = multer({ storage })

module.exports = {
  upload
}
