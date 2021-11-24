const Sequelize = require("sequelize");
const db = require("../db");

const Review = db.define("review", {
  content: {
    type: Sequelize.TEXT,
  },
  createdBy: {
    type: Sequelize.STRING,
  },
  // rating: {
  //   type: Sequelize.ENUM(1, 2, 3, 4, 5),
  //   defaultValue: 5,
  // },
});

module.exports = Review;
