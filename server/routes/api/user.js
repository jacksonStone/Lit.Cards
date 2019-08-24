let express = require('express')
let router = express.Router()
let { getUserDetails, setDarkmode } = require('../../buisness-logic/users/userDetails')
let code = require('../../node-abstractions/response-codes')

router.get('/me', async (req, res) => {
  let user = await getUserDetails(req.userId)
  res.send(user)
})
router.post('/me/darkmode', async (req, res) => {
  if (!req.body || req.body.darkMode === undefined) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  let user = await setDarkmode(req.userId, req.body.darkMode)
  res.send(user)
})

module.exports = router
