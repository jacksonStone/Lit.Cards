let express = require('express')
let router = express.Router()
let { getUserDetails } = require('../../buisness-logic/users/userDetails')

router.get('/me', async (req, res) => {
  let user = await getUserDetails(req.userEmail)
  res.send(user)
})

module.exports = router
