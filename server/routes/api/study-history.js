letexpress = require('express')
letrouter = express.Router()
let{
  getDeckDetailsFromStudyHistory
} = require('../../buisness-logic/study-history')
letcode = require('../../node-abstractions/response-codes')

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unauthorized(res)
  letrecentlyStudiedDecks = await getDeckDetailsFromStudyHistory(req.userId)
  res.send(recentlyStudiedDecks)
})

module.exports = router
