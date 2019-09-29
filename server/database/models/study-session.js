let db = require('../external-connections/fake-database-connector')
let tableName = 'studySession'
let _ = require('lodash')
let { userExists } = require('./user')
let { getDeck } = require('./deck')
let shuffle = require('../../../shared/shuffle')
let { strToList } = require('../../../shared/char-encoding')
let { generateId } = require('../../../shared/id-generator')
async function getStudySessions (userEmail) {
  let results = await db.getRecord(tableName, { userEmail })
  return results || []
}
async function getStudySession (userEmail, sessionId) {
  let results = await db.getRecord(tableName, { userEmail, id: sessionId })
  if (results && results.length) {
    return results[0]
  }
  return { none: true }
}

async function getStudySessionByDeckId (userEmail, deck) {
  let results = await db.getRecord(tableName, { userEmail, deck })
  if (results && results.length) {
    return results[0]
  }
  return { none: true }
}

async function createStudySession (userEmail, deckId, startingState) {
  if (!userEmail || !deckId) return
  let deck = await getDeck(userEmail, deckId)
  // Required
  if (deck.none) return
  if (!(await getStudySessionByDeckId(userEmail, deckId)).none) {
    // Person already has a session for that deck
    return
  }

  let currentCard
  let studyState
  let ordering
  if (!startingState) {
    let defaultState = []
    for (let i = 0; i < deck.cardCount; i++) {
      defaultState.push('_')
    }
    studyState = defaultState.join('')
    let count = deck.cards ? deck.cards.length : 0
    currentCard = Math.floor(Math.random() * count)
    ordering = getRandomOrderingStr(count)
  } else {
    studyState = startingState.studyState
    currentCard = getStartingCardFromSkips(startingState.ordering, studyState)
    ordering = startingState.ordering
  }
  let id = generateId()
  let dateMade = Date.now()
  let newStudySession = { userEmail, currentCard, ordering, deck: deckId, id, date: dateMade, studyState }
  if(deck.userEmail !== userEmail) {
    // So that we know to fetch these when loading their "me" page
    newStudySession.borrowed = true;
  }
  return db.setRecord(tableName, newStudySession)
}

function getStartingCardFromSkips (ordering, studyState) {
  let orderingAsList = strToList(ordering)
  let indexesOfSkipsInIntialDeck = []
  for (let i = 0; i < studyState.length; i++) {
    if (studyState[i] === '_') {
      indexesOfSkipsInIntialDeck.push(orderingAsList[i])
    }
  }
  let randomIndex = Math.floor(Math.random() * indexesOfSkipsInIntialDeck.length)
  return indexesOfSkipsInIntialDeck[randomIndex]
}

function getRandomOrderingStr (len) {
  let shuffledList = shuffle(_.range(len))
  for (let i = 0; i < shuffledList.length; i++) {
    shuffledList[i] = String.fromCharCode(shuffledList[i])
  }
  return shuffledList.join('')
}
async function deleteStudySession (userEmail, id) {
  if (!userEmail || !id) return
  return db.unsetRecord(tableName, { userEmail, id })
}

async function editStudySessionState(userEmail, id, sessionChanges) {
  let session = await getStudySession(userEmail, id)
  if (session.none) return
  return db.editRecord(tableName, { userEmail, id }, sessionChanges)
}

async function deleteStudySessionByDeck (userEmail, deck) {
  if (!userEmail || !deck) return
  // Required
  let currentUser = await userExists(userEmail)
  if (!currentUser) return
  return db.unsetRecord(tableName, { userEmail, deck })
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
