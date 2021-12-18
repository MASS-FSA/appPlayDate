const router = require("express").Router();
const User = require('../db/models/User')

module.exports = router;

//  custom middleware puts user model instance on all api requests via JWT token. used by 'next' routes as req.user
router.use(async (req, res, next) => {
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
});

router.use("/users", require("./routes/users"));
router.use("/channels", require("./routes/channels.js"));
router.use("/messages", require("./routes/messages.js"));
router.use("/events", require("./routes/events"));
router.use("/places", require("./routes/places"))
router.use("/userEvents", require("./routes/userEvents"))
router.use("/friends", require("./routes/friends"))

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
