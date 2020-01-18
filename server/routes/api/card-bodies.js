let express = require('express')
let router = express.Router()
let { getCardBody } = require('../../buisness-logic/card-body')
let code = require('../../node-abstractions/response-codes')
let oneDay = 24 * 60 * 60

router.get('/:deck', async (req, res) => {
  if(!req.userEmail) {
    return code.unauthorized(res)
  }
  let deck = req.params.deck
  let card;
  let lastSeen
  if(req.query) {
    card = req.query.card;
    lastSeen = req.query.t;
  }
  if (!deck) return code.invalidRequest(res)
  let cardBody = await getCardBody(req.userEmail, deck, card)
  if (cardBody) {
    if(lastSeen) {
      res.setHeader('Cache-Control', 'public, max-age=' + oneDay);
    }
    res.send(cardBody)
    return
  }
  return code.invalidRequest(res)
})

module.exports = router
