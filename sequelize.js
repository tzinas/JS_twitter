'use strict'
const config = require('config');
const db = config.get('db');

const { Sequelize, DataTypes } = require('sequelize')

  var sequelize = new Sequelize(db.name, db.username, db.password, {
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
