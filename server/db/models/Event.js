const Sequelize = require('sequelize')
const db = require('../db')

const Event = db.define('event', {
  name: {
    type: Sequelize.STRING,
    defaultValue: 'unNamed Event',
  },
  location: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  }
})

//  FOR REFRENCE
// const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
// const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

module.exports = Event
