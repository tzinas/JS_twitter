const { check, validationResult } = require('express-validator')
const { User } = require('../models')

module.exports = {
  viewProfile: async function (req, res) {
    if (req.user){
      const username = req.params.username
      const user = await User.findOne({where: {username}})
      if (!user){
        res.redirect('/')
      }
      const posts = await user.getPosts({order: [['date', 'DESC']]});
      res.render('user', {user, posts, title: user.username + ' | Post-It', url:'/user'})
    }
    else{
      res.redirect('/login')
    }
  },
  register: async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.render('register', {
        data: req.body,
        errors: errors.mapped(),
        title: 'Register | Post-It',
        user: req.user
      });
    }
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const user = await User.create({ username, email, password});
    req.login(user, function(err) {
      if (err) { return next(err)}
      return res.redirect('/')
    })
  },
  registerValidation: [
    check('username').isLength({ min: 1 }).withMessage('Insert a username').bail()
    .custom(async value => {
      let user = await User.findOne({where: {username:value}})
      if (user !== null){
        return Promise.reject()
      }
    }).withMessage('Username already used').trim(),

    check('email').isLength({ min: 1 }).withMessage('Insert an email').bail()
    .isEmail() .withMessage('Incorrect Email').bail().normalizeEmail()
    .custom(async value => {
      let user = await User.findOne({where: {email:value}})
      if (user !== null){
        return Promise.reject()
      }
    }).withMessage('Email already in use').trim(),

    check('password').isLength({ min: 1 }).withMessage('Insert a password').bail()
    .isLength({ min: 3 }).withMessage('Insert a more secure password'),

    check('repeat_password').custom((value, {req}) => (value === req.body.password)).withMessage('Password does not match')
  ]

}
