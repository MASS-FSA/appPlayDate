const router = require('express').Router()
module.exports = router

router.use('/users', require('./routes/users'))
router.use('/channels', require('./routes/channels.js'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
