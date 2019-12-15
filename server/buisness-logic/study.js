let { StudySession, Deck } = require('../database')
let { pushStudyHistory, removeFromStudyHistory } = require('./study-history')
async function createSession (userEmail, deck, startingState) {
  await removeFromStudyHistory(userEmail, deck)
  return StudySession.createStudySession(userEmail, deck, startingState)
}
async function deleteSession (userEmail, id) {
  let session = await getSession(userEmail, id)
  await pushStudyHistory(userEmail, session.deck)
  return StudySession.deleteStudySession(userEmail, id)
}
async function deleteSessionByDeck (userEmail, deckId) {
  return StudySession.deleteStudySessionByDeck(userEmail, deckId)
}
async function getSession (userEmail, id) {
  return StudySession.getStudySession(userEmail, id)
}
async function getSessionByDeck (userEmail, deckId) {
  return StudySession.getStudySessionByDeckId(userEmail, deckId)
}
async function getSessionsAndBorrowedDecks (userEmail) {
  let sessions = await StudySession.getStudySessions(userEmail)
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
async function editSessionState (userEmail, sessionChanges) {
  let safeChanges = {}
  let id = sessionChanges.id
  delete sessionChanges.id
  if (!id) {
    console.log('No id in session', sessionChanges)
    return
  }
  if (sessionChanges.currentCard !== undefined) {
    safeChanges.currentCard = sessionChanges.currentCard
  }
  if (sessionChanges.studyState !== undefined) {
    safeChanges.studyState = sessionChanges.studyState
  }
  if (sessionChanges.ordering !== undefined) {
    safeChanges.ordering = sessionChanges.ordering
  }
  return StudySession.editStudySessionState(userEmail, id, sessionChanges)
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
