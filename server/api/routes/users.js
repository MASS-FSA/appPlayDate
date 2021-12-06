const router = require("express").Router();
const {
  models: { User, Intake, Friend },
} = require("../../db");

module.exports = router;

// /api/users/nearby/:userId
<<<<<<< HEAD
router.post("/nearby/:userId/", async (req, res, next) => {
=======
router.get("/nearby/:userId/:distance", async (req, res, next) => {
>>>>>>> main
  try {
    const user = await User.findByPk(req.params.userId);
    const output = await user.findNearbyUsers(req.params.distance);

    res.send(output);
  } catch (error) {
    next(error);
  }
});

// /api/users/requests/:userId
router
  .route(`/requests/:userId`)
  .get(async (req, res, next) => {
    try {
      const requests = await Friend.findAll({
        where: { AddresseeId: req.params.userId, status: `pending` },
        // include: { model: User },
      });

      // [{pending request.. userId sean}, {pending request... userId Alex}... ]
      const manualEagerLoad = await Promise.all(
        requests.map(async (request) => {
          let output = { ...request };
          const user = await User.findByPk(request.userId);
          output.requester = user;
          return output;
        })
      );

      res.send(manualEagerLoad);

      // if (!requests) res.send([]);
      // else res.send(requests);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  });

// /api/users/friends/:friendId/:userId
router
  .route(`/friends/:friendId/:userId`)
  .get(async (req, res, next) => {
    // for checking friend request status
    try {
      const connection = await Friend.findOne({
        where: { userId: req.params.userId, AddresseeId: req.params.friendId },
      });
      if (connection) res.send(connection.status);
      else res.send(`none`);
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    // for sending a friend request
    try {
      const user = await User.findByPk(req.params.userId);
      const friend = await User.findByPk(req.params.friendId);
      const connection = await user.addAddressee(friend);
      // const connection = await Friend.create({
      //   where: { userId: req.body.userId, AddresseeId: req.params.friendId },
      // });
      res.send(connection[0].status);
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      if (req.body.status === `blocked` || req.body.status === `accepted`) {
        // When updating a block or accept.. have to update the table both ways for users
        const userOne = await User.findByPk(req.params.userId);
        const userTwo = await User.findByPk(req.params.friendId);

        userOne.addAddressee(userTwo, { through: { status: req.body.status } });
        userTwo.addAddressee(userOne, { through: { status: req.body.status } });

        res.send();
      } else {
        // When updating responses to friend requests
        // const connection = await Friend.findOne({
        //   where: {
        //     userId: req.params.friendId,
        //     AddresseeId: req.params.userId,
        //   },
        // });
        const userOne = await User.findByPk(req.params.userId);
        const userTwo = await User.findByPk(req.params.friendId);

        userTwo.addAddressee(userOne, { through: { status: req.body.status } });

        res.send();
      }
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
      attributes: ["id", "username", "email", "image", "longitude", "latitude"],
    });

    res.send(users);
  } catch (err) {
    next(err);
  }
});
