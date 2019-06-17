const express = require('express')
const router = express.Router()
const { getUserDetails } = require('../../buisness-logic/users/getUserDetails')

router.get('/me', async (req, res) => {
  const user = await getUserDetails(req.userId)
  res.send(user)
})

module.exports = router
