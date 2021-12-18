const router = require("express").Router();
const {
  models: { User, Event, UserEvents, },
} = require("../../db");
const { Op } = require("sequelize");

module.exports = router;

// **/api/events

//  get all events
//  /api/events/
router.get('/', async (req, res, next) => {
  try {
    const allEvents = await Event.findAll();
    res.send(allEvents);
  } catch (error) {
    next(error);
  }
})

//  get events created by user
//  /api/events/myevents
router.get('/myEvents', async (req, res, next) => {
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

//  get events that include user
//  /api/events/participating
router.get('/participating', async (req, res, next) => {
  try {
    const participantIn = await UserEvents.findAll({
      attributes: ['eventId'],
      where: {
        userId: req.user.id
      },
    })
    const eventsIdArray = participantIn.map(userEvent => {
      return userEvent.eventId
    })
    const events = await Event.findAll({
      where: {id: {
        [Op.in]: eventsIdArray
      }}
    })
    res.send(events)
  } catch (err) {
    next(err)
  }
})


//  create a new event
//  /api/events/
router.post('/', async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id
    const newEvent = await Event.create(req.body);
    //  create association
    await req.user.addEvent(newEvent);
    res.send(newEvent);
  } catch (error) {
    next(error);
  }
});

router.get('/:eventId', async (req, res, next) => {
  try {
    const singleEvent = await Event.findByPk(req.params.eventId, {
      include: User,
    });
    res.send(singleEvent);
  } catch (error) {
    next(error);
  }
})

router.delete('/:eventId', (async (req, res, next) => {
  //  this router requires a JWT
  try {
    const eventToBeDeleted = await Event.findOne({
      where: {
        id: req.params.eventId,
        createdBy: req.user.id,
      }
    });
    if (eventToBeDeleted) {
      await eventToBeDeleted.destroy();
      res.send(202);
    } else {
      res.send(405)
    }
  } catch (error) {
    next(error);
  }
}))

router
  .route(`/:eventId`)
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
