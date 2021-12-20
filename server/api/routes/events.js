const eventsRouter = require("express").Router();
const {
  models: { User, Event, UserEvents, },
} = require("../../db");
const { Op } = require("sequelize");

module.exports = eventsRouter;

// **/api/events

//  get all events
//  /api/events/
eventsRouter.get('/', async (req, res, next) => {
  try {
    const allEvents = await Event.findAll();
    res.send(allEvents);
  } catch (error) {
    next(error);
  }
})

//  get events created by user
//  /api/events/myevents
eventsRouter.get('/myEvents', async (req, res, next) => {
  //  this router requires a JWT
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
eventsRouter.get('/participating', async (req, res, next) => {
  try {
    //  this router requires a JWT
    const participantIn = await UserEvents.findAll({
      attributes: ['eventId'],
      where: {
        userId: req.user.id
      },
    })
    const events = await Event.findAll({
      where: {id: {
        [Op.in]: participantIn.map(userEvent => {
          return userEvent.eventId
        })
      }}
    })
    res.send(events)
  } catch (err) {
    next(err)
  }
})

//  get event by Pk
//  /api/events/:id
eventsRouter.get('/:eventId', async (req, res, next) => {
  try {
    const singleEvent = await Event.findByPk(req.params.eventId, {
      include: {
        model: User,
        //  protect user info
        attributes: ['id', 'username', 'image', 'bio']
      }
    });
    res.send(singleEvent);
  } catch (error) {
    next(error);
  }
})

//  create a new event
//  /api/events/
eventsRouter.post('/', async (req, res, next) => {
  //  this router requires a JWT
  try {
    //  put user on the body as createdBy
    req.body.createdBy = req.user.id
    const newEvent = await Event.create(req.body);
    //  create association
    await req.user.addEvent(newEvent);
    res.send(newEvent);
  } catch (error) {
    next(error);
  }
});

//  edit an event
//  api/events/id
eventsRouter.put('/:eventId', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    const update = await event.update(req.body)
    res.send(update)
  } catch (err) {
    next (err)
  }
});

//  delete an event. Checks JWT for event.createdBy to match user sending request.
//  /api/events/:id
eventsRouter.delete('/:eventId', (async (req, res, next) => {
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
      res.send(401)
    }
  } catch (error) {
    next(error);
  }
}))
