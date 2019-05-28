// TODO:: STUDY
const db = require('../externalConnections/fakeData')
const tableName = 'studySession'
const { userExists } = require('./user')
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
  return {}
}

async function createStudySession (userId, deck, studyState) {
  if (!userId || !deck) return
  if (!studyState) {
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
  return db.setRecord(tableName, { userId, deck, id, date: dateMade, studyState })
}

async function deleteStudySession (userId, id) {
  if (!userId || !id) return
  // Required
  const currentUser = await userExists(userId)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userId, id })
}

module.exports = {
  createStudySession,
  getStudySession,
  getStudySessions,
  deleteStudySession
}
