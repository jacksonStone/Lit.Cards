const express = require('express')
const router = express.Router()
const { getCardBody } = require('../../buisness-logic/cardBody')
const code = require('../../node-abstractions/response-codes')

router.get('/', async (req, res) => {
  const deck = req.query.deck
  const card = req.query.card
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  const cardBody = await getCardBody(req.userId, deck, card)
  if (cardBody && cardBody.length) {
    res.send(cardBody[0])
    return
  }
  return code.invalidRequest(res)
})

module.exports = router