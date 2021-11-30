const router = require("express").Router();
const {
  models: { User, Event },
} = require("../../db");

module.exports = router;

// /api/events

router.get("/", async (req, res, next) => {
  try {
    // in future, will need to find single user, and find nearby events.. figure out how to turn address into lat/lng
    const allEvents = await Event.findAll();
    res.send(allEvents);
  } catch (error) {
    next(error);
  }
});

// /api/events/:id

router
  .route(`/:id`)
  .get(async (req, res, next) => {
    try {
      const singleEvent = await Event.findByPk(req.params.id);
      res.send(singleEvent);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deleteEvent = await Event.findByPk(req.params.id);
      await deleteEvent.destroy();
      res.send();
    } catch (error) {
      next(error);
    }
  });
