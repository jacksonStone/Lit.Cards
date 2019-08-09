const { study: studyPage, home } = require('../routes/navigation/pages')
const { getParam } = require('../browser-abstractions/url')
const { listenForKey, resetKey } = require('../browser-abstractions/keyboard')
const { strToList } = require('shared/char-encoding')
const { updateCardBody, flipCard } = require('./deck')
const { setFocusTo } = require('abstract/focus')
const { createStudySession, getStudySession, getStudySessionForDeck, getStudySessions, deleteStudySession, editStudySessionState } = require('../routes/api/study')
// const { reject } = require('utils')
const NOT_ANSWERED = '_'
const RIGHT = 'R'
const WRONG = 'W'
const SKIP = 'S' // Not in this study run

function navigateToStudySession (id) {
  return studyPage({ id })
}
function resetAnswerKeyListeners () {
  // Remove listeners
  resetKey('ArrowLeft')
  resetKey('ArrowRight')
}
function focusOnFlipButton () {
  // Kind of a bad ux if you do not intend to tab navigate,
  // and so do not care about focus
  if (window.lc.getData('tabNavigating')) {
    setFocusTo('#flip-button')
  }
}
function recordTheyAreTabNavigating () {
  window.lc.setData('tabNavigating', true)
}
exports.recordTheyAreTabNavigating = recordTheyAreTabNavigating
exports.flipCard = () => {
  flipCard()
  if (window.lc.getData('showingAnswer')) {
    listenForKey('ArrowLeft', markWrong)
    listenForKey('ArrowRight', markRight)
    return
  }
  resetAnswerKeyListeners()
}
exports.navigateToStudySession = navigateToStudySession

exports.getStudySession = async (id) => {
  id = id || getParam('id')
  if (id) {
    const result = JSON.parse(await getStudySession(id))
    if (result.none) return
    return result
  }
  const deckId = getParam('deck')
  if (deckId) {
    const result = JSON.parse(await getStudySessionForDeck(deckId))
    if (result.none && getParam('upsert')) {
      // Clicked the study button on an edit page
      const newSession = JSON.parse(await createStudySession(deckId))
      return newSession
    }
    return result
  }
}
exports.deleteSession = async (id) => {
  if (window.confirm('Are you sure you want to lose your study progress?')) {
    await deleteStudySession(id)
    // maybedo:: Maybe have this be unset instead
    window.lc.setData('session', { none: true })
  }
}
exports.editStudySessionState = async (session) => {
  const sessionInState = getSessionFromState()
  let id = sessionInState && sessionInState.id
  if (!id) return
  await editStudySessionState(id, session)
}
exports.deleteCurrentSessionWithConfirmation = async () => {
  if (window.confirm('Are you sure you want to lose your study progress?')) {
    await deleteCurrentSessionAndGoHome()
  }
}
const deleteCurrentSessionAndGoHome = exports.deleteCurrentSession = async () => {
  const session = getSessionFromState()
  await deleteStudySession(session.id)
  home()
}
exports.getStudySessions = async () => {
  return JSON.parse(await getStudySessions())
}
const createStudySessionAndNavigate = exports.createStudySession = async (deck, startingState) => {
  const newSession = JSON.parse(await createStudySession(deck, startingState))
  navigateToStudySession(newSession.id)
}
exports.sortCardsBySession = (cards, session) => {
  const ordering = strToList(session.ordering)
  const shuffledCards = []
  for (let i = 0; i < cards.length; i++) {
    shuffledCards.push(cards[ordering[i]])
  }
  return shuffledCards
}
const trimCardsToOnesAwaitingAnswers = exports.trimCardsToOnesAwaitingAnswers = (cards, session) => {
  if (!cards || !cards.length) return cards
  const state = session.studyState
  const unansweredCards = []
  for (let i = 0; i < state.length; i++) {
    const cardState = state[i]
    if (cardState === NOT_ANSWERED) {
      unansweredCards.push(cards[i])
    }
  }
  return unansweredCards
}

function getSessionFromState () {
  return window.lc.getData('session')
}
function getVisibleCardsFromState () {
  return window.lc.getData('orderedCards')
}
function getSessionOrderedCardsFromState () {
  return window.lc.getData('sessionShuffledCards')
}
function updateStudyState (state) {
  window.lc.setPersistent('session.studyState', state)
  const session = getSessionFromState()
  const allOrderedCards = getSessionOrderedCardsFromState()
  const newVisibleCards = trimCardsToOnesAwaitingAnswers(allOrderedCards, session)
  let index = getCurrentCardIndex()
  const cards = getVisibleCardsFromState()

  index++
  const newCard = cards[(index % cards.length)]
  // TODO::Push changes to current card here to persistent store
  window.lc.setData('activeCardId', newCard)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('orderedCards', newVisibleCards)
  if (!newVisibleCards.length) {
    resetAnswerKeyListeners()
    return
  }
  // Grab next card based on index in original deck order
  let newCurrentCard
  const originalCardOrder = window.lc.getData('originalCardOrder')
  for (let i = 0; i < originalCardOrder.length; i++) {
    if (originalCardOrder[i] === newCard) {
      newCurrentCard = i
      break
    }
  }
  window.lc.setPersistent('session.currentCard', newCurrentCard)
  updateCardBody(newCard, undefined, cards)
  focusOnFlipButton()
}
// If a card is added to a deck during the studying process
exports.accountForNewCards = (session, cards) => {
  let count = 0
  const startingLength = session.studyState.length
  const targetLength = cards.length
  while (session.studyState.length < targetLength) {
    session.studyState += '_'
    session.ordering += String.fromCharCode(startingLength + count)
    window.lc.setPersistent('session.studyState', session.studyState)
    window.lc.setPersistent('session.ordering', session.ordering)
    count++
  }
  return session
}
exports.resetSession = async () => {
  const session = getSessionFromState()
  await deleteStudySession(session.id)
  const deck = window.lc.getData('deck')
  await createStudySessionAndNavigate(deck.id)
  // navigate
}
exports.studyWrongAnswers = async () => {
  const session = getSessionFromState()
  await deleteStudySession(session.id)
  const deck = window.lc.getData('deck')
  const studyState = convertRightToSkipsAndWrongsToUnanswered(session.studyState)

  await createStudySessionAndNavigate(deck.id, { studyState, ordering: session.ordering })
}
function convertRightToSkipsAndWrongsToUnanswered (state) {
  const rightsToSkips = state.split(RIGHT).join(SKIP)
  return rightsToSkips.split(WRONG).join(NOT_ANSWERED)
}
exports.getNumberRight = () => {
  const session = getSessionFromState()
  const state = session.studyState
  let count = 0
  for (let i = 0; i < state.length; i++) {
    if (state[i] === RIGHT) count++
  }
  return count
}
exports.getNumberWrong = () => {
  const session = getSessionFromState()
  const state = session.studyState
  let count = 0
  for (let i = 0; i < state.length; i++) {
    if (state[i] === WRONG) count++
  }
  return count
}
function getActiveCardIndexInStudySession () {
  const activeId = window.lc.getData('activeCardId')
  const cards = getSessionOrderedCardsFromState()
  return cards.indexOf(activeId);
}
function getCurrentCardIndex () {
  const currentId = window.lc.getData('activeCardId')
  const cards = window.lc.getData('orderedCards')
  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === currentId) {
      return i
    }
  }
}
const markRight = exports.markRight = () => {
  const cardIndex = getActiveCardIndexInStudySession()
  const state = getSessionFromState().studyState
  const asArray = state.split('')
  asArray[cardIndex] = RIGHT
  const newState = asArray.join('')
  updateStudyState(newState)
}
const markWrong = exports.markWrong = () => {
  // Get session state, modify card to wrong, then go to the next card that works
  // Push changed to session state to "persistent changes"
  // If it's the last card, show menu of if they want to study wrong ones or stop
  const cardIndex = getActiveCardIndexInStudySession()
  const state = getSessionFromState().studyState
  const asArray = state.split('')
  asArray[cardIndex] = WRONG
  const newState = asArray.join('')
  updateStudyState(newState)
}
