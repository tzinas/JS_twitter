'use strict'

const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const { check } = require('express-validator')
const flash = require('req-flash')
const { User } = require('./models')
const reactServer = 'http://localhost:3000'
const httpProxy = require('http-proxy')
const apiProxy = httpProxy.createProxyServer()

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
require('./auth')(passport, LocalStrategy, User)

var cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.locals.moment = require('moment')
app.use('/api/static', express.static('./static/'))
app.use(express.static('public'))
app.use(session({
  resave: true,
  secret: 'cats',
  saveUninitialized: true
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug')

/*
(async () => {
})();
*/
const UserController = require('./controllers/user')

app.post('/api/account/create', UserController.registerValidation, UserController.register)

const SessionController = require('./controllers/session')

app.get('/api/account/logout', SessionController.logout)

app.get('/api/account/verify_credentials', SessionController.verifyCredentials)

app.post('/api/account/login',
function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(200).send(user) }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).send(user)
    })
  })(req, res, next)
}
)

app.get('/api/user/:username', UserController.viewProfile)

app.post('/api/following/create', UserController.followUser)

app.post('/api/following/destroy', UserController.unfollowUser)

const HomeController = require('./controllers/home')

app.get('/api/home', HomeController.viewHome)

const PostController = require('./controllers/post')

app.post('/api/home', [
  check('post').isLength({ min: 1 }).withMessage('Can not submit an empty post!').trim()
], PostController.makePost)

app.all("/*", function(req, res) {
    console.log('redirecting to 3000');
    apiProxy.web(req, res, {target: reactServer});
});

app.listen(4000, () => console.log('Node.js app listening on port 4000.'))
