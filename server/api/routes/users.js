const router = require("express").Router();
const {
  models: { User, Intake, Friend },
} = require("../../db");

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

// /api/users/requests/:userId
router.get(`/requests/:userId`, async (req, res, next) => {
  try {
    const requests = await Friend.findAll({
      where: { AddresseeId: req.params.userId, status: `pending` },
      // include: { model: User },
    });

    // [{pending request.. userId sean}, {pending request... userId Alex}... ]
    const someArray = await Promise.all(
      requests.map(async (request) => {
        let output = { ...request };
        const user = await User.findByPk(request.userId);
        output.requester = user;
        return output;
      })
    );

    // const requesters = requests.map((request) => {
    //   return request.userId;
    // });

    res.send(someArray);

    // if (!requests) res.send([]);
    // else res.send(requests);
  } catch (error) {
    next(error);
  }
});

// /api/users/friends/:friendId
router
  .route(`/friends/:friendId`)
  .put(async (req, res, next) => {
    try {
      // can change req.body to req.user when authentication middleware is implemented.. then change method to GET
      const connection = await Friend.findOne({
        where: { userId: req.body.userId, AddresseeId: req.params.friendId },
      });
      if (connection) res.send(connection.status);
      else res.send(`none`);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.body.userId);
      const friend = await User.findByPk(req.params.friendId);
      const connection = await user.addAddressee(friend);
      // const connection = await Friend.create({
      //   where: { userId: req.body.userId, AddresseeId: req.params.friendId },
      // });
      res.send(connection[0].status);
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
    console.log(req.params.userId);
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
