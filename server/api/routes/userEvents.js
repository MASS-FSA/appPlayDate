const userEventsRouter = require('express').Router();
const {
  models: {User, Event},
} = require('../../db')

module.exports = userEventsRouter;

//  **/api/userEvents

//  associate a user with an event.
//  /api/userEvents/:id

userEventsRouter.put('/:eventId', async (req, res, next) => {
  try {
    const userToAdd = await User.findByPk(req.body.targetId)
    console.log('to add: ' , userToAdd)
    const event = await Event.findByPk(req.params.eventId, {
      include: {
        model: User,
        //  protect user info
        attributes: ['id', 'username', 'image', 'bio']
      }
    })
    await event.addUser(userToAdd)
    //  return the event with the associated users on it
    res.send(event)
  } catch(err) {
    next (err)
  }
})
