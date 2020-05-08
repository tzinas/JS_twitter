'use strict'
const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    // attributes
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  return User
}
