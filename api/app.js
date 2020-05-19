'use strict'

const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const { User } = require('./models')
const reactServer = 'http://localhost:3000'
const httpProxy = require('http-proxy')
const apiProxy = httpProxy.createProxyServer()

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
require('./auth')(passport, LocalStrategy, User)

app.use('/api/static', express.static('./static/'))
app.use(express.static('public'))
app.use(session({
  resave: true,
  secret: 'cats',
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.use(require('./routes'))

app.all('/*', function (req, res) {
  console.log('redirecting to 3000')
  apiProxy.web(req, res, { target: reactServer })
})

app.listen(4000, () => console.log('Node.js app listening on port 4000.'))
