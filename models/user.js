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

  User.associate = (models) => {
    User.hasMany(models.Post);
    User.belongsToMany(models.User, {as: { singular: 'Follower', plural: 'Followers' }, through: 'FollowersTable'});
    User.belongsToMany(models.User, {as: { singular: 'Following', plural: 'Followings' }, through: 'FollowingTable'});
  }

  User.getFeed = async (user, models) => {
    const followings = await user.getFollowings()
    var followingIds = followings.map((following) => {
      return following.id
    })
    followingIds.push(user.id)
    return await models.Post.getCombinedFeed(followingIds, models)
  }
  return User
}
