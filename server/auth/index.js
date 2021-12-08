const router = require('express').Router()
const { models: {User }} = require('../db');
const Friend = require('../db/models/Friend');
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)});
  } catch (err) {
    next(err)
  }
})


router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const user1 = await User.findByPk(1)
    const user2 = await User.findByPk(2)
    const user3 = await User.findByPk(3)
    const user4 = await User.findByPk(4)
    await user.addAddressee(user1)
    await user.addAddressee(user2)
    await user.addAddressee(user3)
    await user.addAddressee(user4)
    const friendShips = await Friend.findAll({where: {userId: user.id}})
    await Promise.all(friendShips.map((friendship)=>{
      return friendship.update({status:'accepted'})
    }))
    res.send({token: await user.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (ex) {
    next(ex)
  }
})
