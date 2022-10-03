const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const { body, validationResult } = require('express-validator')
const cookieSession = require('cookie-session')
const prettyPrintError = require('./utils/ppError')
const express = require('express')
const app = express()

const postRepository = require('./db/repos/post')

app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const ORSS_PORT = process.env.ORSS_PORT || 3000
const ORSS_PASSWORD = process.env.ORSS_PASSWORD || '' // You can have a password, or not.

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('combined'))
} else {
  // We should only log errors in production, we don't really care to log working requests.
  app.use(morgan('combined', {
    skip: (_, res) => res.statusCode < 400
  }))
}

app.use(cookieSession({
  name: 'orss_session',
  path: '/*',
  keys: [process.env.ORSS_SECRET],
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true
}))

app.get('/', (req, res) => {
  res.render('index', { posts: postRepository.findAll() })
})

app.post('/', 
  body('rss').isString().isURL(),
  (req, res) => {
  const errors = validationResult(req).errors.map(prettyPrintError)

  if (errors.length) {
    return res.render('index', { content: '', errors })
  }

  res.render('index')
})

module.exports = () =>
  app.listen(ORSS_PORT, () => console.log(`Listening on port ${ORSS_PORT}, http://localhost:${ORSS_PORT}`))
