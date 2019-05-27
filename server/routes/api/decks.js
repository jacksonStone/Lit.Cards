const express = require('express')
const router = express.Router()
const { addDeck, deleteDeck } = require('../../buisnessLogic/decks/addDeck')
const { getDecks, getDeck } = require('../../buisnessLogic/decks/getDecks')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) return code.invalidRequest(res)
  if (!req.userId) return code.unathorized(res)
  const newDeck = await addDeck(req.userId, req.body.name)
  res.send(newDeck)
})

router.post('/delete', async (req, res) => {
  console.log()
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userId) return code.unathorized(res)
  await deleteDeck(req.userId, req.body.id)
  return code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unathorized(res)
  const decks = await getDecks(req.userId)
  res.send(decks)
})

router.get('/:id', async (req, res) => {
  if (!req.userId) return code.unathorized(res)
  const decks = await getDeck(req.userId, req.params.id)
  res.send(decks)
})

module.exports = router
