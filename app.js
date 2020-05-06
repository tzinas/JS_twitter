const express = require('express')
const session = require('express-session')
const app = express()
const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const FileStore = require('session-file-store')(session);
const {check, validationResult} = require('express-validator');

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

app.use("/static", express.static('./static/'));
app.use(express.static("public"));
app.use(session({
  resave: true,
  secret: "cats",
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug')


const sequelize = new Sequelize('twitter', 'tzinas', 'tzinas', {
  host: 'localhost',
  dialect: 'mariadb'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  // attributes
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // options
});
/*
(async () => {
    await sequelize.sync();
})();
*/

passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      let user = await User.findOne({where: { username }})
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    }
    catch {
      console.log('Failed to query database');
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(
    async function(id, done) {
        let user = await User.findOne({where: { id }})
        done(null, user);
    }
);


app.get('/register', function (req, res) {
  if (req.user){
    res.redirect('/');
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
        return Promise.reject();
      }
    }).withMessage('Username already used').trim().escape(),

  check('email').isLength({ min: 1 }).withMessage('Insert an email').bail()
    .isEmail() .withMessage('Incorrect Email').bail()
    .custom(async value => {
      let user = await User.findOne({where: {email:value}})
      if (user !== null){
        return Promise.reject();
      }
    }).withMessage('Email already used').trim().escape()
    .trim().escape().normalizeEmail(),

  check('password').isLength({ min: 1 }).withMessage('Insert a password').bail()
    .isLength({ min: 3 }).withMessage('Insert a more secure password'),

  check('repeat_password').custom((value, {req}) => (value === req.body.password)).withMessage('Password does not match')
],
  (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', {
      data: req.body,
      errors: errors.mapped()
    });
  }
  next();
}, async (req, res, next) => {
  console.log('Hello');
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  console.log('Hello');
  const user = await User.create({ username, email, password});
  req.register_user = user;
  next();
}, (req, res) => {
  console.log('Hello');
  const user = req.register_user;
  req.login(user, function(err) {
    if (err) { return next(err); }
    return res.redirect('/');
  });

}


);



app.get('/logout', function(req, res){
  console.log('LOG OUT')
  req.logout();
  res.redirect('/login');
});


app.get('/login', function (req, res) {
  if (req.user){
    res.redirect('/');
  }
  else{
    res.render('login');
  }
})


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false })
);

app.get('/', (req, res) => {
  if (req.user){
    res.render('home', {name: req.user.username});
  }
  else{
    res.redirect('/login');
  }
})

app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
