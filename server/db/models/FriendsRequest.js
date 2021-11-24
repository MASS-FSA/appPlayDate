const Sequelize = require("sequelize");
const db = require("../db");

const FriendsRequest = db.define("friendsRequest", {
  specifierId: {
    type: Sequelize.INTEGER,
  },
  status: {
    type: Sequelize.ENUM("accepted", "blocked", "pending", "declined"),
    defaultValue: "pending",
  },
});

module.exports = FriendsRequest;
