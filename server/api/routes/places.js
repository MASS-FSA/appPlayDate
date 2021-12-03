const router = require('express').Router();
const axios = require('axios')
const {
  models: { User, Channel, Message },
} = require('../../db')
const { requireToken } = require('../gatekeeping')
const { createPlacesApiUrl, findMidPoint, distanceBetweenPoints } = require('../../../Util/utilityFuncs')

module.exports = router;

router.get('/find_distance/:id1/:id2', async (req, res, next) => {
  try {
    const user1 = await User.findByPk(req.params.id1)
    const user2 = await User.findByPk(req.params.id2)
    const distance = distanceBetweenPoints(user1.latitude, user1.longitude, user2.latitude, user2.longitude).toFixed(7)
    res.send(distance)
  } catch (err) {
    next (err)
  }
})

router.get('/find_midpoint/:id1/:id2', async (req, res, next) => {
  try {
    const user1 = await User.findByPk(req.params.id1)
    const user2 = await User.findByPk(req.params.id2)
    const distance = findMidPoint(user1.latitude, user1.longitude, user2.latitude, user2.longitude)
    res.send(distance)
  } catch (err) {
    next (err)
  }
})

//  The following 2 routes both get retrieve a list of 'local places/parks' using google places API. The first takes 2 args and the second takes just the 1.

router.get('/:location/:radius', async (req, res, next) => {
  try {
    const {data} = await axios.get(createPlacesApiUrl(req.params.location, req.params.radius))
    const top10Places = data.results.slice(0,10).map((place)=> {
      const {geometry, icon, name, photos, rating, types, vicinity} = place
      const {location} = geometry
      const {lat, lng} = location
      return {name, vicinity, lat, lng, icon, photos, rating, types}
    })
    res.send(top10Places)
  } catch (err) {
    next(err)
  }
})

router.get('/:location', async (req, res, next) => {
  try {
    const {data} = await axios.get(createPlacesApiUrl(req.params.location))
    const top10Places = data.results.slice(0,10)
    res.send(top10Places)
  } catch (err) {
    next(err)
  }
})


//  currently only for testing
router.get('/', async(req, res, next) => {
  res.send('This is a test route only, get with no params was successful')
})
