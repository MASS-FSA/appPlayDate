const Sequelize = require("sequelize");
const db = require("../db");

const Question = db.define(`question`, {
  vaccination: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  favoriteColor: {
    type: Sequelize.ENUM(`blue`, `green`, `purple`),
  },

  age: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 14,
    },
  },
});

module.exports = Question;
