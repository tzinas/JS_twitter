'use strict'
const { Sequelize, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Post = sequelize.define('post',{
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

  return Post
}
