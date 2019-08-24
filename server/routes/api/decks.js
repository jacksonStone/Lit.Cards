let express = require('express')
let router = express.Router()
let { addDeck, deleteDeck, getDecks, getDeck, renameDeck, makeDeckPublic } = require('../../buisness-logic/deck')
let code = require('../../node-abstractions/response-codes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  let newDeck = await addDeck(req.userId, req.body.name)
  res.send(newDeck)
})

router.post('/delete', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await deleteDeck(req.userId, req.body.id)
  return code.ok(res)
})
router.post('/rename', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  if (!req.body.name) return code.ok(res)
  await renameDeck(req.userId, req.body.id, req.body.name)
  return code.ok(res)
})

router.post('/make-public', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await makeDeckPublic(req.userId, req.body.id)
  return code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unauthorized(res)
  let decks = await getDecks(req.userId)
  res.send(decks)
})

// Public route!
router.get('/:id', async (req, res) => {
  // if (!req.userId) return code.unauthorized(res)
  let decks = await getDeck(req.userId, req.params.id)
  res.send(decks)
})

module.exports = router
