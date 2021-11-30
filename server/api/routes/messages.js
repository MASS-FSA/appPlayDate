const router = require('express').Router();
const {
  models: { User, Channel, Message },
} = require('../../db');
const { requireToken } = require('../gatekeeping');

module.exports = router;

// GET /api/messages
// all messages...
router.get('/', async (req, res, next) => {
  try {
    // fix later
    // const users = await User.findAll()
    const messages = await Message.findAll();
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// GET /api/routes/messages/:channelId
// messages by channel id
router.get('/:channelId/', async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const messages = await Message.findAll({
      where: { channelId },
      include: User,
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// POST /api/messages
// Creating a message based off of req.body
router.post('/', requireToken, async (req, res, next) => {
  try {
    const message = await Message.create(req.body);
    message.setUser(req.user.id);
    res.json(message);
  } catch (err) {
    next(err);
  }
});

// PUT /api/messages/:messageId

// DELETE /api/routes/channels
// create frontend " ARE YOU SURE YOU WANT TO DELETE ?"
router.delete('/:messageId', async (req, res, next) => {
  try {
    const id = req.params.messageId;
    await Message.destroy({ where: { id } });
    res.send('Message Deleted').status(204).end();
  } catch (err) {
    next(err);
  }
});
