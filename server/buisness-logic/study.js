let { StudySession, Deck } = require('../database')
let { pushStudyHistory, removeFromStudyHistory } = require('./study-history')
async function createSession (userId, deck, startingState) {
  await removeFromStudyHistory(userId, deck)
  return StudySession.createStudySession(userId, deck, startingState)
}
async function deleteSession (userId, id) {
  let session = await getSession(userId, id)
  await pushStudyHistory(userId, session.deck)
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
async function getSessionsAndBorrowedDecks (userId) {
  let sessions = await StudySession.getStudySessions(userId)
  if (!sessions || !sessions.length) {
    return { sessions: [], borrowedDecks: [] }
  }
  let decksToFetch = sessions.filter(session => session.borrowed).map(session => session.deck)
  if (!decksToFetch || !decksToFetch.length) {
    return { sessions, borrowedDecks: [] }
  }

  let borrowedDecks = await Deck.getByIdsWithCondition(decksToFetch, { public: true })
  return { sessions, borrowedDecks }
}
async function editSessionState (userId, id, sessionChanges) {
  let safeChanges = {}
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
  getSessionsAndBorrowedDecks
}
