const express = require('express')
const router = express.Router()
const { getCardBody, editCardBody } = require('../../buisness-logic/card-body')
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
router.post('/edit', async (req, res) => {
  const deck = req.body.deck
  const card = req.body.card
  const changes = req.body.changes
  delete changes._changeId
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  const cardBody = await getCardBody(req.userId, deck, card)
  if (!cardBody) {
    return code.invalidRequest(res)
  }
  await editCardBody(req.userId, deck, card, changes)
  return code.ok(res)
})

module.exports = router
