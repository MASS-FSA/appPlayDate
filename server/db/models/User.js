const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 5;

const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    // validate: {
    //   isEmail: true,
    // },
  },
  image: {
    type: Sequelize.TEXT,
    defaultValue:
      "https://us.123rf.com/450wm/kyryloff/kyryloff2008/kyryloff200800018/152844692-profile-icon-male-user-icon-ui-button-stock-vector-illustration-isolated-on-white-background-.jpg?ver=6",
    validate: {
      isUrl: true,
    },
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

  address: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  state: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  zipCode: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  bio: {
    type: Sequelize.TEXT,
  },
});

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

User.prototype.findNearbyUsers = async function (distance) {
  try {
    // convert miles to lat and long distance
    // 69 miles per degree of latitude and 54.6 miles per degree of longitude
    let lat = (distance / 69).toFixed(7);
    let lng = (distance / 54.6).toFixed(7);

    // find users withing the given lat and lng
    const users = await User.findAll({
      where: {
        latitude: { [Op.between]: [this.latitude - lat, this.latitude + lat] },
        longitude: {
          [Op.between]: [this.longitude - lng, this.longitude + lng],
        },
      },
    });

    return users;
  } catch (error) {
    console.error(error);
  }
};

/**
 * classMethods
 */
User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username/password");
    error.status = 401;
    throw error;
  }
  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const user = User.findByPk(id);
    if (!user) {
      throw "nooo";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

/**
 * hooks
 */
const hashPassword = async (user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));

module.exports = User;
