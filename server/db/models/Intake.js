const Sequelize = require("sequelize");
const db = require("../db");

const Intake = db.define(`intake`, {
  vaccination: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  favoriteColor: {
    type: Sequelize.STRING,
  },

  age: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 17,
    },
  },
});

module.exports = Intake;
