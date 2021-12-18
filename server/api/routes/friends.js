const router = require("express").Router();
const {
  models: {User, Friend}
} = require('../../db');
const { Op } = require("sequelize");

module.exports = router;

//  ** /api/friends

//  get all friends
//  /api/friends/all
router.get('/', async (req, res, next) => {
  try {
    //  this router requires a JWT
    const myFriends = await Friend.findAll({
      where: {
        userId: req.user.id,
        status: "accepted",
      },
      attributes: ['AddresseeId']
    })
    const friendList = await User.findAll({
      where: { id: {
        [Op.in]: myFriends.map(friend => {
          return friend.AddresseeId
        })
      }}
    })
    res.send(friendList);
  } catch (err) {
    next(err);
  }
});

//  get friend requests
//  /api/friends/requests
router.get('/requests', async (req, res, next) => {
  try {
    //  this router requires a JWT
    //  find pending requests where ser is addressee
    const requests = await Friend.findAll({
      where: {
        AddresseeId: req.user.id,
        status: `pending`
      },
    });
    //  get requester's info
    const requesters = await User.findAll({
      where: {id: {
        [Op.in] : requests.map(request => (request.userId)),
      }},
    //  protect user info
      attributes: ['id', 'username', 'image', 'bio']
    })
    res.send(requesters);
  } catch (error) {
    next(error);
  }
})
