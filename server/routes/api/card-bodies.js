let express = require('express')
let router = express.Router()
let { getCardBody, editCardBody, upsertCardBody, deleteCardBody } = require('../../buisness-logic/card-body')
let code = require('../../node-abstractions/response-codes')

//PUBLIC ROUTE
router.post('/', async (req, res) => {
  let deck = req.body.deck
  let card = req.body.card
  if (!deck) return code.invalidRequest(res)
  let cardBody = await getCardBody(req.userEmail, deck, card)
  if (cardBody && cardBody.length) {
    res.send(cardBody[0])
    return
  }
  return code.invalidRequest(res)
})

module.exports = router
