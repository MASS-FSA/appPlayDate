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

//  get friendship status
//  /api/friends/:friendId
router.get('/:friendId', async (req, res, next) => {
  //  this router requires a JWT
  try {
    const relationship = await Friend.findOne({
      where: {
        userId: req.user.id,
        AddresseeId: req.params.friendId,
      }
    });
    if (relationship) {
      res.send(relationship.status)
    } else {
      res.send('none')
    }
  } catch (err) {
    next (err)
  }
})

//  send a friend request
//  api/friends/:friendId
router.post('/:friendId', async(req, res, next) => {
  //  this router requires a JWT
  try {
    const friend = await User.findByPk(req.params.friendId)
    const update = await req.user.addAddressee(friend)
    res.send(update[0].status)
  } catch (err) {
  }next(err)
})

router.put('')


