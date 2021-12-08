const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("event", {
  name: {
    type: Sequelize.STRING,
    defaultValue: "unNamed Event",
  },
  location: {
    type: Sequelize.STRING,
  },

  time: {
    type: Sequelize.DATE,
    defaultValue: new Date(),
  },

  longitude: {
    type: Sequelize.FLOAT,
    validate: {
      isNumeric: true,
    },
  },
  latitude: {
    type: Sequelize.FLOAT,
    validate: {
      isNumeric: true,
    },
  },

  description: {
    type: Sequelize.TEXT,
  },

  createdBy: {
    type: Sequelize.INTEGER,
  },

  image: {
    type: Sequelize.TEXT,
    defaultValue: `https://assets.rebelmouse.io/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8xODMwNzc2My9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTY3MTkzNTYwMX0.lHK0h7BhP9FgVrL0xNdfW9kyYEaCNRk8MLXzGv3VzVQ/img.jpg?width=1245&quality=85&coordinates=66%2C0%2C67%2C0&height=700`,
  },
});

//  FOR REFRENCE
// const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
// const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];

module.exports = Event;
