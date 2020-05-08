'use strict'

const express = require('express')
const session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const flash = require('req-flash')
const sequelize = require('./sequelize')

const User = require('./models/user')(sequelize)
const Post = require('./models/post')(sequelize)


var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

Post.belongsTo(User)
User.hasMany(Post);


const pass = require('./auth')(passport, LocalStrategy, User)

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



app.get('/register', function (req, res) {
  if (req.user){
    res.redirect('/')
  }
  else{
    res.render('register', {
      data: {},
      errors: {}
    });
  }
})


app.post('/register', [
  check('username').isLength({ min: 1 }).withMessage('Insert a username').bail()
    .custom(async value => {
      let user = await User.findOne({where: {username:value}})
      if (user !== null){
        return Promise.reject()
      }
    }).withMessage('Username already used').trim().escape(),

  check('email').isLength({ min: 1 }).withMessage('Insert an email').bail()
    .isEmail() .withMessage('Incorrect Email').bail().normalizeEmail()
    .custom(async value => {
      let user = await User.findOne({where: {email:value}})
      if (user !== null){
        return Promise.reject()
      }
    }).withMessage('Email already used').trim().escape()
    .trim().escape(),

  check('password').isLength({ min: 1 }).withMessage('Insert a password').bail()
    .isLength({ min: 3 }).withMessage('Insert a more secure password'),

  check('repeat_password').custom((value, {req}) => (value === req.body.password)).withMessage('Password does not match')
],
  (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('register', {
      data: req.body,
      errors: errors.mapped()
    });
  }
  next();
}, async (req, res, next) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const user = await User.create({ username, email, password});
  req.register_user = user
  next();
}, (req, res) => {
  const user = req.register_user
  req.login(user, function(err) {
    if (err) { return next(err)}
    return res.redirect('/')
  });
});



app.get('/logout', function(req, res){
  console.log('LOG OUT')
  req.logout();
  res.redirect('/login')
});


app.get('/login', function (req, res) {
  if (req.user){
    res.redirect('/')
  }
  else{
    res.render('login')
  }
})


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false })
);

app.get('/:username', async (req, res, next) => {
    if (req.user){
      const username = req.params.username
      const user = await User.findOne({where: {username}})
      if (!user){
        res.redirect('/')
      }
      const posts = await user.getPosts({order: [['date', 'DESC']]});
      res.render('user', {user, posts})
    }
    else{
      res.redirect('/login')
    }
  }
)


app.get('/', (req, res) => {
  if (req.user){
    res.render('home', {user: req.user, data: {}, errors: {}, success: req.flash('success')})
  }
  else{
    res.redirect('/login')
  }
})

app.post('/', [
  check('post').isLength({ min: 1 }).withMessage('Can not submit an empty post!').trim().escape()
], (req, res, next) =>{
    if (req.user){
      const errors = validationResult(req)
      if (!errors.isEmpty()) {

        return res.render('home', {
          user: req.user,
          data: req.body,
          errors: errors.mapped()
        });
      }
      next();
    }
  }, async (req, res, next) => {
    const content = req.body.post
    const user = req.user;
    const post = await Post.create({content})
    console.log(post.content)
    await post.setUser(user)
    await user.addPost(post)

    next();
  }, (req, res) => {
      req.flash("success", "Your post is live!")
      return res.redirect('/')
  }
);


app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
