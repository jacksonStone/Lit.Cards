const express = require('express')
const router = express.Router()
const { getUserDetails } = require('../../buisnessLogic/users/getUserDetails')

router.get('/me', async (req, res) => {
  const user = await getUserDetails(req.username)
  res.send(user)
  res.end()
})

module.exports = router
