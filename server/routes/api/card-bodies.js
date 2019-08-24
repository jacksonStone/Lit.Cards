let express = require('express')
let router = express.Router()
let { getCardBody, editCardBody, addCardBody, deleteCardBody } = require('../../buisness-logic/card-body')
let code = require('../../node-abstractions/response-codes')

//PUBLIC ROUTE
router.post('/', async (req, res) => {
  let deck = req.body.deck
  let card = req.body.card
  if (!deck) return code.invalidRequest(res)
  let cardBody = await getCardBody(req.userId, deck, card)
  if (cardBody && cardBody.length) {
    res.send(cardBody[0])
    return
  }
  return code.invalidRequest(res)
})
router.post('/edit', async (req, res) => {
  let deck = req.body.deck
  let card = req.body.card
  let changes = req.body.changes
  delete changes._changeId;
  //They cannot update public this way
  delete changes.public;
  //They cannot alter the deck a card is associated with
  delete changes.deck;
  //They cannot alter the id of a card
  delete changes.id;
  //They cannot alter the user of a card
  delete changes.userId;
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  let cardBody = await getCardBody(req.userId, deck, card)
  if (!cardBody) {
    return code.invalidRequest(res)
  }
  await editCardBody(req.userId, deck, card, changes)
  return code.ok(res)
})
router.post('/add', async (req, res) => {
  let deck = req.body.deck
  let changes = req.body.changes
  delete changes._changeId
  delete changes.isNew
  // Add a card here toos
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  let newId = await addCardBody(req.userId, deck, changes)
  res.send(newId)
})
router.post('/delete', async (req, res) => {
  let deck = req.body.deck
  let card = req.body.card
  if (!deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await deleteCardBody(req.userId, deck, card)
  return code.ok(res)
})

module.exports = router
