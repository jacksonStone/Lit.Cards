const db = require('../external-connections/fake-database-connector')
const tableName = 'studySession'
const _ = require('lodash')
const { userExists } = require('./user')
const { getDeck } = require('./deck')
const shuffle = require('../../../shared/shuffle')
const { strToList } = require('../../../shared/char-encoding')
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

async function createStudySession (userId, deckId, startingState) {
  if (!userId || !deckId) return
  const deck = await getDeck(userId, deckId)
  // Required
  if (deck.none) return
  if (!(await getStudySessionByDeckId(userId, deckId)).none) {
    // Person already has a session for that deck
    return
  }

  let currentCard
  let studyState
  let ordering
  if (!startingState) {
    const defaultState = []
    for (let i = 0; i < deck.cardCount; i++) {
      defaultState.push('_')
    }
    studyState = defaultState.join('')
    const count = deck.cards ? deck.cards.length : 0
    currentCard = Math.floor(Math.random() * count)
    ordering = getRandomOrderingStr(count)
  } else {
    studyState = startingState.studyState
    currentCard = getStartingCardFromSkips(startingState.ordering, studyState)
    ordering = startingState.ordering
  }
  const id = generateId()
  const dateMade = Date.now()
  const newStudySession = { userId, currentCard, ordering, deck: deckId, id, date: dateMade, studyState }
  if(deck.userId !== userId) {
    // So that we know to fetch these when loading their "me" page
    newStudySession.borrowed = true;
  }
  return db.setRecord(tableName, newStudySession)
}

function getStartingCardFromSkips (ordering, studyState) {
  const orderingAsList = strToList(ordering)
  const indexesOfSkipsInIntialDeck = []
  for (let i = 0; i < studyState.length; i++) {
    if (studyState[i] === '_') {
      indexesOfSkipsInIntialDeck.push(orderingAsList[i])
    }
  }
  const randomIndex = Math.floor(Math.random() * indexesOfSkipsInIntialDeck.length)
  return indexesOfSkipsInIntialDeck[randomIndex]
}

function getRandomOrderingStr (len) {
  const shuffledList = shuffle(_.range(len))
  for (let i = 0; i < shuffledList.length; i++) {
    shuffledList[i] = String.fromCharCode(shuffledList[i])
  }
  return shuffledList.join('')
}
async function deleteStudySession (userId, id) {
  if (!userId || !id) return
  return db.unsetRecord(tableName, { userId, id })
}

async function editStudySessionState(userId, id, sessionChanges) {
  const session = await getStudySession(userId, id)
  if (session.none) return
  return db.editRecord(tableName, { userId, id }, sessionChanges)
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
  editStudySessionState,
  getStudySessionByDeckId,
  getStudySessions,
  deleteStudySession,
  deleteStudySessionByDeck
}
