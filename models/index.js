'use strict'

const { Sequelize, DataTypes } = require('sequelize')
const models = {}

var sequelize = new Sequelize('twitter', 'tzinas', 'tzinas', {
  host: 'localhost',
  dialect: 'mariadb'
})

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.')
})
.catch(err => {
  console.error('Unable to connect to the database:', err)
})

models.User = require('./user')(sequelize, DataTypes)
models.Post = require('./post')(sequelize, DataTypes)

models.User.associate(models)
models.Post.associate(models)

module.exports = models
