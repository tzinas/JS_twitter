'use strict'

const { Sequelize, DataTypes } = require('sequelize')

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
module.exports = sequelize
