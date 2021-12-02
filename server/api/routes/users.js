const router = require("express").Router();
const {
  models: { User, Intake },
} = require("../../db");
const Intake = require("../../db/models/Intake");

module.exports = router;

// /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username", "email", "image", "longitude", "latitude"],
    });

    res.send(users);
  } catch (err) {
    next(err);
  }
});

// /api/users/nearby/:userId
router.post("/nearby/:userId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const output = await user.findNearbyUsers(req.body.distance);

    res.send(output);
  } catch (error) {
    next(error);
  }
});

// /api/users/:userId
router
  .route(`/:userId`)
  .get(async (req, res, next) => {
    try {
      const singleUser = await User.findByPk(req.params.userId, {
        include: Intake,
      });
      res.send(singleUser);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const updatedUser = await User.findByPk(req.params.userId);
      await updatedUser.update(req.body);
      res.send(await updatedUser.reload());
    } catch (error) {
      next(error);
    }
  });

// /api/users/intakes/:userId

router.route(`/intakes/:userId`).post(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    await user.createIntake(req.body);
    res.send(200);
  } catch (error) {
    next(error);
  }
});
