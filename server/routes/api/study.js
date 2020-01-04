let express = require('express')
let router = express.Router()
let {
  createSession,
  deleteSession,
  getSession,
  getSessionByDeck,
  getSessionsAndBorrowedDecks
} = require('../../buisness-logic/study')
let code = require('../../node-abstractions/response-codes')
let {requireActiveSub} = require('./middleware');

router.post('/create', requireActiveSub, async (req, res) => {
  if (!req.body || !req.body.deck) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  let newSession = await createSession(req.userEmail, req.body.deck, req.body.startingState)
  res.send(newSession)
})

router.post('/delete', requireActiveSub, async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userEmail) return code.unauthorized(res)
  await deleteSession(req.userEmail, req.body.id)
  return code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userEmail) return code.unauthorized(res)
  let sessionsAndDecks = await getSessionsAndBorrowedDecks(req.userEmail)
  res.send(sessionsAndDecks)
})

// TODO:: Make a local session for folks to study
router.get('/:id', requireActiveSub, async (req, res) => {
  if (!req.userEmail || !req.params.id) return code.unauthorized(res)
  let session = await getSession(req.userEmail, req.params.id)
  res.send(session)
})
router.get('/deck/:id', requireActiveSub, async (req, res) => {
  if (!req.userEmail || !req.params.id) return code.unauthorized(res)
  let session = await getSessionByDeck(req.userEmail, req.params.id)
  res.send(session)
})

module.exports = router
