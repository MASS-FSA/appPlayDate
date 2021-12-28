const usersRouter = require("express").Router();
const {
  models: { User, Intake},
} = require("../../db");
const { distanceBetweenPoints } = require('../../../Util/utilityFuncs')

module.exports = usersRouter;

//  ** /api/users

//  get all users
// /api/users
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      //  protect user data
      attributes: ['id', 'username', 'email', 'image', 'bio'],
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

// get nearby users based on distance parameter
// /api/users/nearby/user/:userId/distance/:distance
usersRouter.get("/nearby/distance/:dis", async (req, res, next) => {
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

//  get a user by Id
//  /api/users/:userId
usersRouter.get('/:userId', async (req, res, next) => {
  try {
    const singleUser = await User.findByPk(req.params.userId, {
      include: Intake,
      //  protect user info
      attributes: ['id', 'username', 'image', 'bio']
    });
    res.send(singleUser);
  } catch (error) {
    next(error);
  }
})

//  for a user updates their own profile
//  /api/users/
usersRouter.post('/', async (req, res, next) => {
  //  this router requires a JWT
  try {
    await req.user.update(req.body)
    const updatedUser = User.findOne({
      where: {
        id: req.user.id
      },
      include: Intake
    })
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

//  creates the intake form onto the User
//  /api/users/intakes
usersRouter.post(`/intakes`).post(async (req, res, next) => {
  //  this router requires a JWT
  try {
    await req.user.createIntake(req.body);
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
});


