const models = require('../models')
const { validationResult } = require('express-validator')

module.exports = {
  makePost: async function (req, res) {
    if (req.user){
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(401).json({ error: errors.mapped() })
      }
      const content = req.body.post
      const user = req.user
      const post = await models.Post.create({content})
      await post.setUser(user)
      await user.addPost(post)
      const posts = await models.User.getFeed(req.user, models)
      return res.status(200).json({success: "Your post is live!", posts})

    }
  }

}
