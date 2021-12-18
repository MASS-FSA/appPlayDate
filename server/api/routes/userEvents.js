const router = require('express').Router();
const {
  models: {User, Event},
} = require('../../db')

module.exports = router;

//  **/api/userEvents

//  associate a user with an event.
//  /api/userEvents/:id

router.post('/:eventId', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId, {
      include: {
        model: User,
        //  protect user info
        attributes: ['username']
      }
    })
    await event.addUser(req.user)
    //  return the event with the associated users on it
    res.send(event)
  } catch(error) {
    next (error)
  }
})
