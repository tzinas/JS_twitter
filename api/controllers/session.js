module.exports = {
  logout: function (req, res) {
    req.logout();
    res.status(200).send()
  },
  verifyCredentials: function (req, res) {
    if (req.user) {
      res.status(200).json({user: req.user})
    }
    else {
      res.status(401).json({error: 'User not authenticated'})
    }
  }
}
