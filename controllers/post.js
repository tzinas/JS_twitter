const { Post } = require('../models')
const { validationResult } = require('express-validator')
const { Op } = require("sequelize")

module.exports = {
  makePost: async function (req, res) {
    if (req.user){
      const followings = await req.user.getFollowings()
      var followingIds = []

      followings.forEach((following, i) => {
        followingIds.push(following.id)
      })


      var posts = await Post.findAll({
        where: {
          userId: {
            [Op.or]: followingIds
          }
        }
      })
      if (followingIds.length == 0){
        posts = []
      }
      var postAuthors = []
      for (i=0; i<posts.length; i++){
        var author = await posts[i].getUser()
        postAuthors.push(author.username)
      }
      const errors = validationResult(req)
      if (!errors.isEmpty()) {

        return res.render('home', {
          user: req.user,
          data: req.body,
          errors: errors.mapped(),
          title: 'Post-It',
          url: '/',
          posts,
          postAuthors

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
