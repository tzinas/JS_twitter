'use strict'
const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (sequelize, DataTypes) => {
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

  User.beforeCreate( (user, options) => {
    const hash = bcrypt.hashSync(user.password, saltRounds);
    user.password = hash;
  })


  return User
}
