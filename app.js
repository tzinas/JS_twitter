const express = require('express')
const session = require('express-session')
const app = express()
const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const FileStore = require('session-file-store')(session);

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


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
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // options
});



(async () => {
  await sequelize.sync({ force: true });
    const tzinas = await User.create({ username: "tzinas", password: "tzinas"});
    const susan = await User.create({ username: "susan", password: "susan"});
    //console.log(tzinas.toJSON());
})();

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            let user = await User.findOne({where: { username: username }})
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
        let user = await User.findOne({where: { id: id }})
        done(null, user); 
    }
);


app.get('/login', function (req, res) {
    res.render('login');
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
