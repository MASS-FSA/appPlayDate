const Sequelize = require('sequelize');
const db = require('../db');

const Channel = db.define('channel', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'NewChannel',
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  createdBy: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Channel;
