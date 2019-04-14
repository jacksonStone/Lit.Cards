const express = require('express')
const router = express.Router()
const { addDeck } = require('../../buisnessLogic/decks/addDeck')
const { getDecks } = require('../../buisnessLogic/decks/getDecks')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) return code.invalidRequest(res)
  if (!req.username) return code.unathorized(res)
  await addDeck(req.username, req.body.name)
  code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.username) return code.unathorized(res)
  const decks = await getDecks(req.username)
  res.send(decks)
  res.end()
})

module.exports = router
