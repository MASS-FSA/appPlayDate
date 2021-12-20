const placesRouter = require('express').Router();
const axios = require('axios')
const {
  models: { User,},
} = require('../../db')
const { createPlacesApiUrl, findMidPoint, distanceBetweenPoints } = require('../../../Util/utilityFuncs')

module.exports = placesRouter;

//  ** /api/places

//  get the distance between 2 users
//  /api/places/find_distance/user1/id/user2/id
placesRouter.get('/find_distance/user1/:id1/user2/:id2', async (req, res, next) => {
  try {
    const user1 = await User.findByPk(req.params.id1)
    const user2 = await User.findByPk(req.params.id2)
    // see util functions
    const distance = distanceBetweenPoints(user1.latitude, user1.longitude, user2.latitude, user2.longitude)
    res.send(distance)
  } catch (err) {
    next (err)
  }
})

//  get the midpoint between 2 users
//  /api/places/find_midpoint/user1/id/user2/id
placesRouter.get('/find_midpoint/user1/:id1/user2/:id2', async (req, res, next) => {
  try {
    const user1 = await User.findByPk(req.params.id1)
    const user2 = await User.findByPk(req.params.id2)
    //  see util functions
    const distance = findMidPoint(user1.latitude, user1.longitude, user2.latitude, user2.longitude)
    res.send(distance)
  } catch (err) {
    next (err)
  }
})

//  The following route retrieves a list of 'local places/parks' using google places API. Takes 2 params but only location is required.

placesRouter.get('/location/:location/radius/:radius', async (req, res, next) => {
  try {
    //  use the utility function and req.params to crate the external api call.
    const {data} = await axios.get(createPlacesApiUrl(req.params.location, req.params.radius))
    //  cut down the api response to 10 hits and prunes the res Obj to make it more useful and readable for our needs.
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
