const { Post } = require('../models')
const { validationResult } = require('express-validator')

module.exports = {
  makePost: async function (req, res) {
    if (req.user){
      const errors = validationResult(req)
      if (!errors.isEmpty()) {

        return res.render('home', {
          user: req.user,
          data: req.body,
          errors: errors.mapped(),
          title: 'Post-It',
          url: '/'
        });
      }
      const content = req.body.post
      const user = req.user;
      const post = await Post.create({content})
      console.log(post.content)
      await post.setUser(user)
      await user.addPost(post)
      req.flash("success", "Your post is live!")
      return res.redirect('/')

    }
  }

}
