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
async function editSessionState(userId, id, sessionChanges) {
  const safeChanges = {}
  if (sessionChanges.currentCard !== undefined) {
    safeChanges.currentCard = sessionChanges.currentCard
  }
  if (sessionChanges.studyState !== undefined) {
    safeChanges.studyState = sessionChanges.studyState
  }
  if (sessionChanges.ordering !== undefined) {
    safeChanges.ordering = sessionChanges.ordering
  }
  return StudySession.editStudySessionState(userId, id, sessionChanges)
}

module.exports = {
  createSession,
  deleteSession,
  editSessionState,
  getSessionByDeck,
  deleteSessionByDeck,
  getSession,
  getSessions
}
