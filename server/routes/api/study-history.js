let express = require('express')
let router = express.Router()
let{
  getDeckDetailsFromStudyHistory
} = require('../../buisness-logic/study-history')
let code = require('../../node-abstractions/response-codes')

router.get('/me', async (req, res) => {
  if (!req.userEmail) return code.unauthorized(res)
  let recentlyStudiedDecks = await getDeckDetailsFromStudyHistory(req.userEmail)
  res.send(recentlyStudiedDecks)
})

module.exports = router
