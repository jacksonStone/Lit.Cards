// TODO:: STUDY
const db = require('../externalConnections/fakeData')
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
  const currentUser = await userExists(userId)
  if (!currentUser) return

  let currentCard
  let studyState
  let ordering
  if (!startingState) {
    const defaultState = []
    for (let i = 0; i < deck.cardCount; i++) {
      defaultState.push('_')
    }
    studyState = defaultState.join('')
    currentCard = Math.floor(Math.random() * deck.cardCount)
    ordering = getRandomOrderingStr(deck.cardCount)
  } else {
    studyState = startingState.studyState
    currentCard = getStartingCardFromSkips(startingState.ordering, studyState)
    ordering = startingState.ordering
  }

  const id = generateId()
  const dateMade = Date.now()
  return db.setRecord(tableName, { userId, currentCard, ordering, deck: deckId, id, date: dateMade, studyState })
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
