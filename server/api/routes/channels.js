const router = require('express').Router();
const {
  models: { Channel, Message },
} = require('../../db');
const User = require('../../db/models/User');
const { requireToken } = require('../gatekeeping');

module.exports = router;

// GET /api/channels/
router
  .route(`/`)
  .get(async (req, res, next) => {
    try {
      // fix later
      // const users = await User.findAll()
      const channels = await Channel.findAll();

      res.send(channels);
    } catch (err) {
      next(err);
    }
  })
  .post(requireToken, async (req, res, next) => {
    // Creating a channel based off of req.body
    try {
      req.body.createdBy = req.user.id;
      const channel = await Channel.create(req.body);
      res.send(channel);
    } catch (err) {
      next(err);
    }
  });

// GET /api/channels/:channelId/messages
router.get('/:channelId/messages', requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    const channelId = req.params.channelId;
    const findUser = await Message.findOne({
      where: { channelId, userId: user.id },
    });
    if (!findUser) {
      res.send('access denied');
    } else {
      const messages = await Message.findAll({ where: { channelId } });
      res.send(messages);
    }
  } catch (err) {
    next(err);
  }
});

// DELETE /api/channels
// create frontend " ARE YOU SURE YOU WANT TO DELETE ?"
router.delete('/:channelId', async (req, res, next) => {
  try {
    const id = req.params.channelId;
    await Channel.destroy({ where: { id } });
    res.send('Channel Deleted').status(204).end();
  } catch (err) {
    next(err);
  }
});
