const express = require('express')
const router = express.Router()
const {
  createSession,
  deleteSession,
  editSessionState,
  getSession,
  getSessionByDeck,
  getSessions
} = require('../../buisness-logic/study')
const code = require('../../node-abstractions/response-codes')

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.deck) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  const newSession = await createSession(req.userId, req.body.deck, req.body.startingState)
  res.send(newSession)
})

router.post('/delete', async (req, res) => {
  if (!req.body || !req.body.id) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await deleteSession(req.userId, req.body.id)
  return code.ok(res)
})
router.post('/edit', async (req, res) => {
  if (!req.body || !req.body.id || !req.body.session) return code.invalidRequest(res)
  if (!req.userId) return code.unauthorized(res)
  await editSessionState(req.userId, req.body.id, req.body.session)
  return code.ok(res)
})

router.get('/me', async (req, res) => {
  if (!req.userId) return code.unauthorized(res)
  const sessions = await getSessions(req.userId)
  res.send(sessions)
})
router.get('/:id', async (req, res) => {
  if (!req.userId || !req.params.id) return code.unauthorized(res)
  const session = await getSession(req.userId, req.params.id)
  res.send(session)
})
router.get('/deck/:id', async (req, res) => {
  if (!req.userId || !req.params.id) return code.unauthorized(res)
  const session = await getSessionByDeck(req.userId, req.params.id)
  res.send(session)
})

module.exports = router
