const { check, validationResult } = require('express-validator')
const { User } = require('../models')

module.exports = {
  viewProfile: async function (req, res) {
    if (req.user) {
      const user = req.user
      const profileUsername = req.query.userProfile
      const profileUser = await User.findOne({ where: { username: profileUsername } })
      if (!profileUser) {
        res.status(404).send()
      }
      const posts = await profileUser.getPosts({ order: [['date', 'DESC']], include: [User] })
      const followers = await profileUser.countFollowers()
      const following = await profileUser.countFollowings()
      const isFollowing = await user.hasFollowing(profileUser)
      res.status(200).json({ profileUser, posts, socialStatus: { followers, following, isFollowing } })
    } else {
      res.status(401).send()
    }
  },
  register: async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(401).send({ errors: errors.mapped(), data: req.body })
    }
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const user = await User.create({ username, email, password })
    req.login(user, function (err) {
      if (err) { return next(err) }
      return res.status(200).send()
    })
  },
  registerValidation: [
    check('username').isLength({ min: 1 }).withMessage('Insert a username').bail()
      .custom(async value => {
        const user = await User.findOne({ where: { username: value } })
        if (user !== null) {
          return Promise.reject(new Error('Used username'))
        }
      }).withMessage('Username already used').trim(),

    check('email').isLength({ min: 1 }).withMessage('Insert an email').bail()
      .isEmail().withMessage('Incorrect Email').bail().normalizeEmail()
      .custom(async value => {
        const user = await User.findOne({ where: { email: value } })
        if (user !== null) {
          return Promise.reject(new Error('Used email address'))
        }
      }).withMessage('Email already in use').trim(),

    check('password').isLength({ min: 1 }).withMessage('Insert a password').bail()
      .isLength({ min: 3 }).withMessage('Insert a more secure password'),

    check('repeatPassword').custom((value, { req }) =>
      (value === req.body.password)).withMessage('Password does not match')
  ],
  unfollowUser: async (req, res) => {
    if (req.user) {
      const currentUser = req.user
      const profileUsername = req.body.profileUsername
      const profileUser = await User.findOne({ where: { username: profileUsername } })
      if (!profileUser || profileUsername === currentUser.username) {
        res.status(404).send()
      }
      currentUser.removeFollowing(profileUser)
      profileUser.removeFollower(currentUser)
      res.status(200).send()
    } else {
      res.status(401).send()
    }
  },
  followUser: async (req, res) => {
    if (req.user) {
      const currentUser = req.user
      const profileUsername = req.body.profileUsername
      const profileUser = await User.findOne({ where: { username: profileUsername } })
      if (!profileUser || profileUsername === currentUser.username) {
        res.status(401).send()
      }
      currentUser.addFollowing(profileUser)
      profileUser.addFollower(currentUser)
      res.status(200).send()
    } else {
      res.status(401).send()
    }
  }
}
