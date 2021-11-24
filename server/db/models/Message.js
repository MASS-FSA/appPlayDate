const Sequelize = require('sequelize')
const db = require('../db')

const Message = db.define('message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
    },
  messageContent: {
    type: Sequelize.TEXT
  },
})

module.exports = Message
