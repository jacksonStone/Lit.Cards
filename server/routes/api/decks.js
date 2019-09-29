let express = require('express')
let router = express.Router()
let { addDeck, deleteDeck, getDecks, getDeck, renameDeck, makeDeckPublic } = require('../../buisness-logic/deck')
let code = require('../../node-abstractions/response-codes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  let newDeck = await addDeck(req.userEmail, req.body.name)
  res.send(newDeck)
})

router.post('/delete', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  await deleteDeck(req.userEmail, req.body.id)
  return code.ok(res)
})
router.post('/rename', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  if (!req.body.name) return code.ok(res)
  await renameDeck(req.userEmail, req.body.id, req.body.name)
  return code.ok(res)
})

router.post('/make-public', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  await makeDeckPublic(req.userEmail, req.body.id)
  return code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userEmail) return code.unauthorized(res)
  let decks = await getDecks(req.userEmail)
  res.send(decks)
})

// Public route!
router.get('/:id', async (req, res) => {
  // if (!req.userEmail) return code.unauthorized(res)
  let decks = await getDeck(req.userEmail, req.params.id)
  res.send(decks)
})

module.exports = router
