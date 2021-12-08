const router = require("express").Router();
const {
  models: { User, Event },
} = require("../../db");

module.exports = router;

// /api/events

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
  .put(async (req, res, next) => {
    try {
      // find creator and add to event
      const creator = await User.findByPk(req.body.createdBy);
      const newEvent = await Event.create(req.body);
      await creator.addEvent(newEvent);
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
