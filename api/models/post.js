'use strict'
const { Sequelize, Op } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    }
  })

  Post.associate = (models) => {
    Post.belongsTo(models.User)
  }

  Post.getCombinedFeed = async (followingIds, models) => {
    let posts = await Post.findAll({
      where: {
        userId: {
          [Op.or]: followingIds
        }
      },
      order: [['date', 'DESC']],
      include: [models.User]
    })
    if (followingIds.length === 0) {
      posts = []
    }
    return posts
  }

  Post.exportName = 'Post'

  return Post
}
