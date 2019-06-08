const { study: studyPage } = require('site/pages')
const { getParam } = require('abstract/url')
const { listenForKey, resetKey } = require('abstract/keyboard')
const { strToList } = require('shared/char-encoding')
// TODO:: Move this some
const { updateCardBody, flipCard } = require('../ui/page-content/deck/helper')
const { createStudySession, getStudySession, getStudySessionForDeck, getStudySessions } = require('api/study')
// const { reject } = require('utils')
const NOT_ANSWERED = '_'
const RIGHT = 'R'
const WRONG = 'W'
// const MISSING = 'M' // Not in this study run

function navigateToStudySession (id) {
  return studyPage({ id })
}
exports.flipCard = () => {
  flipCard()
  if (window.lc.getData('showingAnswer')) {
    listenForKey('ArrowLeft', markWrong)
    listenForKey('ArrowRight', markRight)
    return
  }
  // Remove listeners
  resetKey('ArrowLeft')
  resetKey('ArrowRight')
}
exports.navigateToStudySession = navigateToStudySession

exports.getStudySession = async (id) => {
  id = id || getParam('id')
  if (id) {
    return JSON.parse(await getStudySession(id))
  }
  const deckId = getParam('deck')
  if (deckId) {
    return JSON.parse(await getStudySessionForDeck(deckId))
  }
}
exports.getStudySessions = async () => {
  return JSON.parse(await getStudySessions())
}
exports.createStudySession = async (deck, startingState) => {
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
  // return trimCardsToOnesAwaitingAnswers(shuffledCards, session)
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
  // TODO:: Handle empty states/last card
  let index = getCurrentCardIndex()
  const cards = getVisibleCardsFromState()
  index++
  const newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('orderedCards', newVisibleCards)
  updateCardBody(newCard.id)
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
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (card.id === activeId) {
      return i
    }
  }
}
function getCurrentCardIndex () {
  const currentId = window.lc.getData('activeCardId')
  const cards = window.lc.getData('orderedCards')
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === currentId) {
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
