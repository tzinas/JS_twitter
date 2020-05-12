const models = require('../models')

module.exports = {
  viewHome: async function viewHome(req, res) {
    if (req.user){

      const posts = await models.User.getFeed(req.user, models)
      res.render('home', {user: req.user, data: {}, errors: {},
        success: req.flash('success'), title: 'Post-It', url: '/', posts})
    }
    else{
      res.redirect('/login')
    }
  }
}
