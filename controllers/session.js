module.exports = {
  loginForm: function (req, res) {
    if (req.user){
      res.redirect('/')
    }
    else{
      res.render('login', {user: req.user, title: 'Login | Post-It'})
    }
  },
  logout: function (req, res){
    req.logout();
    res.redirect('/login')
  }

}
