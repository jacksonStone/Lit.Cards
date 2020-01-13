let db = require('../external-connections/configured-connector')
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
  let results = await db.getRecord(tableName, { userEmail, id: sessionId }, 1)
  if (results) {
    return results;
  }
  return { none: true }
}

async function getStudySessionByDeckId (userEmail, deck) {
  let results = await db.getRecord(tableName, { userEmail, deck }, 1)
  if (results) {
    return results
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
    studyState = '';
    let count = deck.cards ? deck.cards.length : 0
    for (let i = 0; i < count; i++) {
      studyState += '_'
    }
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
  let ordering = '';
  for (let i = 0; i < shuffledList.length; i++) {
    ordering += String.fromCharCode(shuffledList[i])
  }
  return ordering;
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
