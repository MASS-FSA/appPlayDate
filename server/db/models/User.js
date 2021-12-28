const Sequelize = require("sequelize");
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { distanceBetweenPoints } = require("../../../Util/utilityFuncs");

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
    defaultValue: "https://i.imgur.com/gZxm3dc.png",
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

  homeLongitude: {
    type: Sequelize.FLOAT,
    validate: {
      isNumeric: true,
    },
  },
  homeLatitude: {
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
    if (token){
      const { id } = await jwt.verify(token, process.env.JWT);
      const user = User.findByPk(id);
      if (!user) {
        throw "nooo";
      }
      return user;
    }
    return {
      fail: true,
      token: token,
    }
  } catch (ex) {
    const error = Error(" bad token");
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
