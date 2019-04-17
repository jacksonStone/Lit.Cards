const express = require('express')
const router = express.Router()
const { addDeck } = require('../../buisnessLogic/decks/addDeck')
const { getDecks } = require('../../buisnessLogic/decks/getDecks')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) return code.invalidRequest(res)
  if (!req.userId) return code.unathorized(res)
  await addDeck(req.userId, req.body.name)
  code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unathorized(res)
  const decks = await getDecks(req.userId)
  res.send(decks)
})

module.exports = router
