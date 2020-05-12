const models = require('../models')
const { validationResult } = require('express-validator')

module.exports = {
  makePost: async function (req, res) {
    if (req.user){
      const errors = validationResult(req)
      if (!errors.isEmpty()) {

        const posts = await models.User.getFeed(req.user, models)
        return res.render('home', { user: req.user, data: req.body,
          errors: errors.mapped(), title: 'Post-It', url: '/', posts})
      }
      const content = req.body.post
      const user = req.user;
      const post = await models.Post.create({content})
      await post.setUser(user)
      await user.addPost(post)
      req.flash("success", "Your post is live!")
      return res.redirect('/')

    }
  }

}
