const express = require('express')
const router = express.Router()
const { addCard } = require('../../buisnessLogic/cards/addCard')
const { getCards } = require('../../buisnessLogic/cards/getCards')
const code = require('../../nodeAbstractions/responseCodes')

router.post('/create', async (req, res) => {
  if (!req.body) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  if (!req.body.deck) return code.invalidRequest(res)
  if (!req.body.content) return code.invalidRequest(res)
  await addCard(req.userId, req.body.deck, req.body.content)
  code.ok(res)
})

router.get('/me', async (req, res) => {
  const deck = req.query.deck
  if (!deck) return code.invalidRequest(res)
  const cards = await getCards(req.userId, deck)
  if (!cards || !cards.length) {
    return res.send([])
  }
  const trimmedCards = cards.map(card => {
    delete card.userId
    delete card.deck
    return card
  })
  res.send(trimmedCards)
})

module.exports = router
