const Sequelize = require("sequelize");
const db = require("../db");

const UserEvents = db.define(`userEvents`, {
  createdBy: {
    type: Sequelize.INTEGER,
  },
});

module.exports = UserEvents;
