'use strict'

const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const flash = require('req-flash')

const { User, Post } = require('./models')


var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var moment = require('moment')
app.locals.moment = require('moment')


require('./auth')(passport, LocalStrategy, User)

app.use('/static', express.static('./static/'))
app.use(express.static('public'))
app.use(session({
  resave: true,
  secret: 'cats',
  saveUninitialized: true
}))
app.use(flash())
app.use(bodyParser.urlencoded({ extended: false }))
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

app.get('/register', UserController.registerForm)

app.post('/register', UserController.registerValidation, UserController.register);

const SessionController = require('./controllers/session')

app.get('/logout', SessionController.logout);

app.get('/login', SessionController.loginForm)


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false })
);


app.get('/:username', UserController.viewProfile)

app.get('/follow/:username', async (req, res) => {
  if (req.user){
    const currentUser = req.user
    const username = req.params.username
    const user = await User.findOne({where: {username}})
    const url = '/' + username
    if (!user){
      res.redirect(url)
    }
    currentUser.addFollowing(user)
    user.addFollower(currentUser)
    res.redirect(url)
  }
})

app.get('/unfollow/:username', async (req, res) => {
  if (req.user){
    const currentUser = req.user
    const username = req.params.username
    const user = await User.findOne({where: {username}})
    const url = '/' + username
    if (!user){
      res.redirect(url)
    }
    currentUser.removeFollowing(user)
    user.removeFollower(currentUser)
    res.redirect(url)
  }
})

const HomeController = require('./controllers/home')

app.get('/', HomeController.viewHome)

const PostController = require('./controllers/post')

app.post('/', [
  check('post').isLength({ min: 1 }).withMessage('Can not submit an empty post!').trim()
], PostController.makePost);


app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
