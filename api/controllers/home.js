const models = require('../models')

module.exports = {
  viewHome: async function viewHome(req, res) {
    if (req.user){
      console.log("Show Home")
      const posts = await models.User.getFeed(req.user, models)
      res.json({user: req.user, posts})
    }
    else{
      console.log("I am here")
      res.json({user: req.user})
    }
  }
}
