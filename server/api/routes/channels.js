const router = require("express").Router();
const {
  models: { Channel, Message, User },
} = require("../../db");
const { requireToken } = require("../gatekeeping");

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
  .post(async (req, res, next) => {
    // Creating a channel based off of req.body
    try {
      req.body.createdBy = req.user.id;
      const channel = await Channel.create(req.body);
      const chatBot = await User.findOne({ where: { username: `Chat Bot` } });
      const message = await Message.create({
        where: { content: `Welcome to ${channel.name} chat!` },
      });
      await message.setChannel(channel);
      await message.setUser(chatBot);
      res.send(channel);
    } catch (err) {
      next(err);
    }
  });

// GET /api/channels/:channelId/messages
router.get("/:channelId/messages", requireToken, async (req, res, next) => {
  try {
    const user = req.user;
    const channelId = req.params.channelId;
    const findUser = await Message.findOne({
      where: { channelId, userId: user.id },
    });
    if (!findUser) {
      res.send("access denied");
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
router.delete("/:channelId", requireToken, async (req, res, next) => {
  try {
    const channel = await Channel.findByPk(req.params.channelId);

    if (channel.createdBy === req.user.id) {
      await channel.destroy();
      res.send(202);
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    next(err);
  }
});
