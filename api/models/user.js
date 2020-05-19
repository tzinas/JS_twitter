'use strict'
const bcrypt = require('bcryptjs')
const saltRounds = 10

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
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

  User.beforeCreate((user, options) => {
    const hash = bcrypt.hashSync(user.password, saltRounds)
    user.password = hash
  })

  User.associate = (models) => {
    User.hasMany(models.Post)
    User.belongsToMany(models.User, {
      as: { singular: 'Follower', plural: 'Followers' },
      through: 'FollowsTable',
      foreignKey: 'followerId'
    })
    User.belongsToMany(models.User, {
      as: { singular: 'Following', plural: 'Followings' },
      through: 'FollowsTable',
      foreignKey: 'followingId'
    })
  }

  User.getFeed = async (user, models) => {
    const followings = await user.getFollowings()
    var followingIds = followings.map(following => following.id)
    followingIds.push(user.id) // To include current user's posts
    return await models.Post.getCombinedFeed(followingIds, models)
  }

  User.exportName = 'User'

  return User
}
