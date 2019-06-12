// TODO:: STUDY
const db = require('../externalConnections/fakeData')
const tableName = 'studySession'
const { userExists } = require('./user')
const { getDeck } = require('./deck')

const { generateId } = require('../../../shared/id-generator')
async function getStudySessions (userId) {
  const results = await db.getRecord(tableName, { userId })
  return results || []
}
async function getStudySession (userId, sessionId) {
  const results = await db.getRecord(tableName, { userId, id: sessionId })
  if (results && results.length) {
    return results[0]
  }
  return { none: true }
}

async function getStudySessionByDeckId (userId, deck) {
  const results = await db.getRecord(tableName, { userId, deck })
  if (results && results.length) {
    return results[0]
  }
  return { none: true }
}

async function createStudySession (userId, deckId, studyState) {
  if (!userId || !deckId) return
  const deck = await getDeck(userId, deckId)
  // Required
  if (deck.none) return
  if (!(await getStudySessionByDeckId(userId, deckId)).none) {
    // Person already has a session for that deck
    return
  }
  if (!studyState && !deck.none) {
    const defaultState = []
    for (let i = 0; i < deck.cardCount; i++) {
      defaultState.push('_')
    }
    studyState = defaultState.join('')
  }
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  const id = generateId()
  const dateMade = Date.now()
  return db.setRecord(tableName, { userId, deck: deckId, id, date: dateMade, studyState })
}

async function deleteStudySession (userId, id) {
  if (!userId || !id) return
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userId, id })
}

async function deleteStudySessionByDeck (userId, deck) {
  if (!userId || !deck) return
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userId, deck })
}

module.exports = {
  createStudySession,
  getStudySession,
  getStudySessionByDeckId,
  getStudySessions,
  deleteStudySession,
  deleteStudySessionByDeck
}
