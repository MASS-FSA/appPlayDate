const channelRouter = require("express").Router({mergeParams: true, strict: true});
const {
  models: { Channel, Message },
} = require("../../db");
const User = require("../../db/models/User");


module.exports = channelRouter;

// channel refers to chat channels.

//  ** /api/channels/

//  get all channels
//  /api/channels/
channelRouter.get('/', async (req, res, next) => {
  try {
    const channels = await Channel.findAll();
    res.send(channels);
  } catch (err) {
    next(err);
  }
})

//  get channels the user has created
//  /api/channels/owned
channelRouter.get('/owned', async (req, res, next) => {
  try {
    const owned = await Channel.findAll({
      where: {
        createdBy: req.user.id
      }
    })
    res.send(owned)
  } catch(err) {
    next(err)
  }
})

//  get messages by channelId
//  /api/channels/:channelId/messages
channelRouter.get("/:channelId/messages", async (req, res, next) => {
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

//  create new channel
//  /api/channels/
  channelRouter.post('/', async(req, res, next) => {
  try {
    // put user.id on the createdBy key
    req.body.createdBy = req.user.id;
    const channel = await Channel.create(req.body);

    const chatBot = await User.findOne({ where: { username: `Chat Bot` } });
    const message = await Message.create({
      content: `Welcome to ${channel.name} chat!`,
    });
    await message.setChannel(channel);
    await message.setUser(chatBot);
    res.send(channel);
  } catch (err) {
    next(err);
  }
});

//  delete a chat channel
//  /api/channels
channelRouter.delete("/:channelId", async (req, res, next) => {
  try {
    const channel = await Channel.findByPk(req.params.channelId);

    if(channel) {
      if(channel.createdBy === req.user.id) {
        await channel.destroy();
        res.sendStatus(202)
      } else {
        res.sendStatus(405)
      }
    } else {
      res.sendStatus(400)
    }
  } catch (err) {
    next(err);
  }
});
