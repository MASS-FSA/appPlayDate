const router = require("express").Router();
const {
  models: { User, Intake, Friend },
} = require("../../db");
const { Op } = require('sequelize')
const { distanceBetweenPoints } = require('../../../Util/utilityFuncs')

module.exports = router;

//  ** /api/users

// get nearby users based on distance parameter
// /api/users/nearby/user/:userId/distance/:distance
router.get("/nearby/distance/:dis", async (req, res, next) => {
  try {
    //  this router requires a JWT
    const users = await User.findAll();
    //  filter users for those within 'distance' parameter
    const nearByUsers = users.filter((user) => {
      const dist = distanceBetweenPoints(
        req.user.latitude,
        req.user.longitude,
        user.homeLatitude,
        user.homeLongitude
      );
      return dist <= req.params.dis
    })
    .map(user => {
        //  protect user data
        const {id, username, image, bio} = user
        return {id, username, image, bio}
      })
    res.send(nearByUsers)
  } catch (error) {
    console.error(error);
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

      res.send(await updatedUser.reload({ include: Intake }));
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

// /api/users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username", "email", "image"],
    });

    res.send(users);
  } catch (err) {
    next(err);
  }
});
