const router = require('express').Router();
const axios = require('axios')
const {
  models: { User, Channel, Message },
} = require('../../db')
const { requireToken } = require('../gatekeeping')
const { createPlacesApiUrl } = require('../placesUtil')

module.exports = router;

router.get('/:location/:radius', async (req, res, next) => {
  try {
    const {data} = await axios.get(createPlacesApiUrl(req.params.location, req.params.radius))
    const top10Places = data.results.slice(0,10)
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
