const messagesRouter = require("express").Router();
const {
  models: { User, Channel, Message },
} = require("../../db");
const { Op } = require("sequelize");

module.exports = messagesRouter;

//  ** /api/messages

//  get all messages
//  /api/messages/
messagesRouter.get("/", async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      include: {
        model: User,
        //  protect user info
        attributes: ['id', 'username', 'image', 'bio']
      }
    });
    res.send(messages);
  } catch (err) {
    next(err);
  }
});

//  get channels that one have a message in
//  /api/messages/channels/participant
messagesRouter.get("/channels/participant", async (req, res, next) => {
  //  this route requires a JWT
  try {
    const messages = await Message.findAll({
      where: {
        userId: req.user.id,
      },
    });
    //  get rid of duplicates
    const channelSet = new Set(messages.map(message => (message.channelId)))
    const channels = await Channel.findAll({
      where: {id: {
          [Op.in]: [...channelSet],
        }}
      }
    )
    res.send(channels);
  } catch (err) {
    next(err);
  }
});


// messages by channel id
// /api/routes/messages/:channelId
messagesRouter.get("/:channelId/", async (req, res, next) => {
  try {
    const messages = await Message.findAll({
      where: { channelId: req.params.channelId },
      include: {
        model: User,
        //  protect user info
        attributes: ['id', 'username', 'image', 'bio']
      }
    });
    res.send(messages);
  } catch (err) {
    next(err);
  }
});

//  Creating a message based off of req.body
//  /api/messages/
messagesRouter.post("/", async (req, res, next) => {
  try {
    //  put userId on message
    req.body.userId = req.user.id;
    const message = await Message.create(req.body);
    //  make association
    await message.setUser(req.user);
    //  get last message with user on it
    const newMessage = await Message.findOne({
      order: [["id", "DESC"]],
      include: {
        model: User,
        //  protect user info
        attributes: ['id', 'username', 'image', 'bio']
      }
    });
    res.send(newMessage);
  } catch (err) {
    next(err);
  }
});

//  delete message by Id
messagesRouter.delete("/:messageId", async (req, res, next) => {
  try {
    const id = req.params.messageId;
    await Message.destroy({ where: { id } });
    res.sendStatus(204)
  } catch (err) {
    next(err);
  }
});
