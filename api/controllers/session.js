const passport = require('passport')

module.exports = {
  logout: function (req, res) {
    req.logout()
    res.status(200).send()
  },
  verifyCredentials: function (req, res) {
    if (req.user) {
      res.status(200).json({ user: req.user })
    } else {
      res.status(401).json({ error: 'User not authenticated' })
    }
  },
  login: function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.status(401).send({ msg: 'No such user' }) }
      req.logIn(user, function (err) {
        if (err) { return next(err) }
        return res.status(200).send(user)
      })
    })(req, res, next)
  }
}
