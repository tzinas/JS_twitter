'use strict'

const { Sequelize, DataTypes } = require('sequelize')
const db = {}

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

db.User = require('./user')(sequelize, DataTypes)
db.Post = require('./post')(sequelize, DataTypes)

module.exports = db
