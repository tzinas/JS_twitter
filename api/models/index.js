'use strict'
require('dotenv').config()

const fs = require('fs')
const path = require('path')

const Sequelize = require('sequelize')
const models = {}
const basename = path.basename(__filename)

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_USER,
  dialect: process.env.DB_DIALECT
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    file.slice(-3) === '.js'
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    models[model.exportName] = model
  })

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
