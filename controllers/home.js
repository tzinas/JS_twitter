const { User, Post } = require('../models')
const { Op } = require("sequelize")

module.exports = {
  viewHome: async function viewHome(req, res) {
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
        },
        order: [['date', 'DESC']]
      })

      if (followingIds.length == 0){
        posts = []
      }
      var postAuthors = []
      for (i=0; i<posts.length; i++){
        var author = await posts[i].getUser()
        postAuthors.push(author.username)
      }

      console.log(postAuthors)

      res.render('home', {user: req.user, data: {}, errors: {}, success: req.flash('success'), title: 'Post-It', url: '/', posts, postAuthors})
    }
    else{
      res.redirect('/login')
    }
  }
}
