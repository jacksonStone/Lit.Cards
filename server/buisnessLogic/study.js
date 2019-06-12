const { StudySession } = require('../database')
async function createSession (userId, deck, startingState) {
  return StudySession.createStudySession(userId, deck, startingState)
}
async function deleteSession (userId, id) {
  return StudySession.deleteStudySession(userId, id)
}
async function deleteSessionByDeck (userId, deckId) {
  return StudySession.deleteStudySessionByDeck(userId, deckId)
}
async function getSession (userId, id) {
  return StudySession.getStudySession(userId, id)
}
async function getSessionByDeck (userId, deckId) {
  return StudySession.getStudySessionByDeckId(userId, deckId)
}
async function getSessions (userId) {
  return StudySession.getStudySessions(userId)
}

module.exports = {
  createSession,
  deleteSession,
  getSessionByDeck,
  deleteSessionByDeck,
  getSession,
  getSessions
}
