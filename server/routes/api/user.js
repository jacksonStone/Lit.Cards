let express = require('express')
let router = express.Router()
let { getUserDetails, setDarkmode, setMisc } = require('../../buisness-logic/users/userDetails')
let code = require('../../node-abstractions/response-codes')

router.get('/me', async (req, res) => {
  let user = await getUserDetails(req.userId)
  res.send(user)
})
router.post('/me/misc', async (req, res) => {
  if (!req.body || !Object.keys(req.body).length) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  let user = await setMisc(req.userId, req.body)
  res.send(user)
})

module.exports = router
