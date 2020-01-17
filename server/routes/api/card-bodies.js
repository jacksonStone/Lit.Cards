let express = require('express')
let router = express.Router()
let { getCardBody } = require('../../buisness-logic/card-body')
let code = require('../../node-abstractions/response-codes')

router.get('/:deck/:card', async (req, res) => {
  if(!req.userEmail) {
    return code.unauthorized(res)
  }
  let deck = req.params.deck
  let card = req.params.card
  if (!deck) return code.invalidRequest(res)
  let cardBody = await getCardBody(req.userEmail, deck, card)
  if (cardBody) {
    res.send(cardBody)
    return
  }
  return code.invalidRequest(res)
})

module.exports = router
