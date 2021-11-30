const Sequelize = require("sequelize");
const db = require("../db");

const Friend = db.define("friend", {
  status: {
    type: Sequelize.ENUM("accepted", "blocked", "pending", "declined"),
    defaultValue: "pending",
  },
});

module.exports = Friend;
