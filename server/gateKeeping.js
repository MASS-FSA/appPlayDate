const {
  models: { User },
} = require('./db');
// store all functions here to act as middleware between requests and response
const addJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    if(user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addJWT,
};
