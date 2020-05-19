var express = require('express')
var router = express.Router()

const UserController = require('./controllers/user')

router.post('/api/account/create', UserController.registerValidation, UserController.register)

router.get('/api/user', UserController.viewProfile)

router.post('/api/following/create', UserController.followUser)

router.post('/api/following/destroy', UserController.unfollowUser)

const SessionController = require('./controllers/session')

router.get('/api/account/logout', SessionController.logout)

router.get('/api/account/verify_credentials', SessionController.verifyCredentials)

router.post('/api/account/login', SessionController.login)

const PostController = require('./controllers/post')

router.get('/api/posts/home', PostController.postsHome)

router.post('/api/post/create', PostController.postValidation, PostController.makePost)

module.exports = router
