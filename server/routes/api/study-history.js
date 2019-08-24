let express = require('express')
let router = express.Router()
let{
  getDeckDetailsFromStudyHistory
} = require('../../buisness-logic/study-history')
let code = require('../../node-abstractions/response-codes')

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unauthorized(res)
  let recentlyStudiedDecks = await getDeckDetailsFromStudyHistory(req.userId)
  res.send(recentlyStudiedDecks)
})

module.exports = router
