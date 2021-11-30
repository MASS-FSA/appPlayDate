const router = require('express').Router();
const {
  models: { Channel, Message },
} = require('../../db');

module.exports = router;

// GET /api/channels/
router.get('/', async (req, res, next) => {
  try {
    // fix later
    // const users = await User.findAll()
    const channels = await Channel.findAll();

    res.send(channels);
  } catch (err) {
    next(err);
  }
});

// GET /api/channels/:channelId/messages
router.get('/:channelId/messages', async (req, res, next) => {
  try {
    /* some logic here to the effect of:
    if(user doesn't exist on channel) res.send('access denied');
    else{ everything below goes here } */
    const channelId = req.params.channelId;
    const messages = await Message.findAll({ where: { channelId } });
    res.send(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/channels/
// Creating a channel based off of req.body
router.post('/', async (req, res, next) => {
  try {
    const channel = await Channel.create(req.body);
    res.send(channel);
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
