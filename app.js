const express = require('express')
const session = require('express-session')
const app = express()
const {Sequelize, DataTypes} = require('sequelize');
const fs = require('fs');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;



app.engine('pug', require('pug').__express)
app.set('views', './views')
app.set('view engine', 'pug')


app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


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

passport.deserializeUser(function(id, done) {
    done(null, id);
});


app.get('/login', function (req, res) {
    res.render('login');
}
)


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

app.get('/', (req, res) => {
    if (req.user){
        console.log('Tha name is ' + JSON.stringify(req.user));

        //res.render('home', {name: req.);
        res.send('Heeeeello World!');
    }
    else{
        res.redirect('/login');
    }
})


app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
