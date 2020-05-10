module.exports = {
  loginForm: function (req, res) {
    if (req.user){
      res.redirect('/')
    }
    else{
      res.render('login', {user: req.user, title: 'Login | Post-It'})
    }
  }
}
