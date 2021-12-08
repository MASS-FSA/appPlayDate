const router = require("express").Router();
const { reset } = require("nodemon");
const {
  models: { User, Event, UserEvents },
} = require("../../db");
const {requireToken} = require("../gatekeeping")

module.exports = router;

// /api/events

router.get('/myEvents', requireToken, async (req, res, next) => {
  try {
    const myEvents = await Event.findAll({
      where: {
        createdBy: req.user.id
      }
    })
    res.send(myEvents)
  } catch (err) {
    next(err)
  }
})

router.get('/participating', requireToken, async (req, res, next) => {

  try {
    const participantIn = await UserEvents.findAll({
      where: {
        userId: req.user.id
      }
    })
    const stepTwo = participantIn.map(userEvent => {
      return userEvent.eventId
    })
    const events = await Promise.all(stepTwo.map(id => {
      return Event.findByPk(id)
    }))
    res.send(events)
  } catch (err) {
    next(err)
  }
})

router
  .route(`/`)
  .get(async (req, res, next) => {
    try {
      // in future, will need to find single user, and find nearby events.. figure out how to turn address into lat/lng
      const allEvents = await Event.findAll();
      res.send(allEvents);
    } catch (error) {
      next(error);
    }
  })
  .post(requireToken, async (req, res, next) => {
    try {
      // use token and add to event
      req.body.createdBy = req.user.id
      const newEvent = await Event.create(req.body);
      await req.user.addEvent(newEvent);
      res.send(newEvent);
    } catch (error) {
      next(error);
    }
  });

// /api/events/:eventId

router
  .route(`/:eventId`)
  .get(async (req, res, next) => {
    try {
      const singleEvent = await Event.findByPk(req.params.eventId, {
        include: User,
      });
      res.send(singleEvent);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deleteEvent = await Event.findByPk(req.params.eventId);
      await deleteEvent.destroy();
      res.send();
    } catch (error) {
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const editEvent = await Event.findByPk(req.params.eventId);
      res.send(await editEvent.update(req.body));
    } catch (error) {
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const userToAdd = await User.findByPk(req.body.userId);
      const event = await Event.findByPk(req.params.eventId, { include: User });
      await event.addUser(userToAdd);
      res.send(await event.reload());
    } catch (error) {
      next(error);
    }
  });
