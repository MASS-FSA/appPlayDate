const router = require("express").Router();
const {
  models: { User, Channel, Message },
} = require("../../db");

module.exports = router;

// GET /api/routes/channels/
router.get("/", async (req, res, next) => {
  try {
    // fix later  
    const users = await User.findAll()
    const channels = await Channel.findAll({where:{users}});

    res.json(channels);
  } catch (err) {
    next(err);
  }
});

// GET /api/routes/channels/:channelId/messages
router.get('/:channelId/messages', async (req, res, next) => {
  try {
    const channelId = req.params.channelId 
    const messages = await Message.findAll( {where: {channelId}})
    // more here for user identification maybe include or through
    res.json(messages)
  } catch (err) {
    next(err)
  }
})

// POST /api/routes/channels/
// Creating a channel based off of req.body
router.post("/", async (req,res,next) => {
  try {
    const channel = await Channel.create(req.body);
    // maybe more here for user identification maybe include or through?
    res.json(channel);
  } catch(err) {
    next(err)
  }
})

// DELETE /api/routes/channels
// create frontend " ARE YOU SURE YOU WANT TO DELETE ?"
router.delete('/:channelId', async (req, res, next) => {
  try {
    const id = req.params.channelId;
    await Channel.destroy({where: {id}})
    res.status(204 /*a number*/)
  } catch (err) {
    next(err)
  }
})