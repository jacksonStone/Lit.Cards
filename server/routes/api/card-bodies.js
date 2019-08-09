const express = require('express')
const router = express.Router()
const { getCardBody, editCardBody, addCardBody, deleteCardBody } = require('../../buisness-logic/card-body')
const code = require('../../node-abstractions/response-codes')

router.post('/', async (req, res) => {
  const deck = req.body.deck
  const card = req.body.card
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
router.post('/add', async (req, res) => {
  const deck = req.body.deck
  const changes = req.body.changes
  delete changes._changeId
  delete changes.isNew
  // Add a card here toos
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  const newId = await addCardBody(req.userId, deck, changes)
  res.send(newId)
})
router.post('/delete', async (req, res) => {
  const deck = req.body.deck
  const card = req.body.card
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await deleteCardBody(req.userId, deck, card)
  return code.ok(res)
})

module.exports = router
