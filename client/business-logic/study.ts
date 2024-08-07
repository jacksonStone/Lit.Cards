import { study as studyPage, home } from '../routes/navigation/pages'
import { getParam } from '../browser-abstractions/url'
import { listenForKey, resetKey } from '../browser-abstractions/keyboard'
import { strToList } from 'shared/char-encoding'
import { updateCardBody, flipCard as flipDeckCard } from './deck'
import { setFocusTo } from 'abstract/focus'
import {
  createStudySession as createStudySessionAPI,
  getStudySession as getStudySessionAPI,
  getStudySessionForDeck as getStudySessionForDeckAPI,
  getStudySessionsAndBorrowedDecks as getStudySessionsAndBorrowedDecksAPI,
  deleteStudySession as deleteStudySessionAPI
} from '../routes/api/study'
import 'types';

// let { reject } = require('utils')
let NOT_ANSWERED = '_'
let RIGHT = 'R'
let WRONG = 'W'
let SKIP = 'S' // Not in this study run

function navigateToStudySession (id: string) {
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

export const flipCard = () => {
  flipDeckCard()
  if (window.lc.getData('showingAnswer')) {
    listenForKey('ArrowLeft', markWrong)
    listenForKey('ArrowRight', markRight)
    return
  }
  resetAnswerKeyListeners()
}

export { recordTheyAreTabNavigating, navigateToStudySession }

export const getStudySession = async (id?: string) :Promise<StudySession> => {
  id = id || getParam('id')
  if (id) {
    let result = JSON.parse(await getStudySessionAPI(id))
    if (result.none) return
    return result
  }
  let deckId = getParam('deck')
  if (deckId) {
    let result = JSON.parse(await getStudySessionForDeckAPI(deckId))
    if (result.none && getParam('upsert')) {
      // Clicked the study button on an edit page
      let newSession = JSON.parse(await createStudySessionAPI(deckId))
      return newSession
    }
    return result
  }
}

export const deleteSession = async (id: string) => {
  if (window.confirm('Are you sure you want to lose your study progress?')) {
    await deleteStudySessionAPI(id)
    // maybedo:: Maybe have this be unset instead
    window.lc.setData('session', { none: true })
  }
}

export const deleteCurrentSessionWithConfirmation = async () => {
  if (window.confirm('Are you sure you want to lose your study progress?')) {
    await deleteCurrentSessionAndGoHome()
  }
}

const deleteCurrentSessionAndGoHome = async () => {
  let session = getSessionFromState()
  await deleteStudySessionAPI(session.id)
  home()
}
export const deleteCurrentSession = deleteCurrentSessionAndGoHome
interface StudySessionsAndBorrowedDecks {
  sessions: Array<StudySession>,
  borrowedDecks: Array<Deck>
}
export const getStudySessionsAndBorrowedDecks = async (): Promise<StudySessionsAndBorrowedDecks> => {
  return JSON.parse(await getStudySessionsAndBorrowedDecksAPI())
}

const createStudySessionAndNavigate = async (deck: string, startingState?: startingStudyState) => {
  let newSession = JSON.parse(await createStudySessionAPI(deck, startingState))
  navigateToStudySession(newSession.id)
}
// gross
export const createStudySession = createStudySessionAndNavigate

export const sortCardsBySession = (cards: string, session: StudySession) :Array<string> => {
  let ordering = strToList(session.ordering)
  let shuffledCards = []
  for (let i = 0; i < cards.length; i++) {
    shuffledCards.push(cards[ordering[i]])
  }
  return shuffledCards
}

export const trimCardsToOnesAwaitingAnswers = (cards: string, session: StudySession) :Array<string>|undefined => {
  if (!cards || !cards.length) return;
  let state = session.studyState
  let unansweredCards = []
  for (let i = 0; i < state.length; i++) {
    let cardState = state[i]
    if (cardState === NOT_ANSWERED) {
      unansweredCards.push(cards[i])
    }
  }
  return unansweredCards
}

function getSessionFromState () :StudySession {
  return window.lc.getData('session')
}
function getVisibleCardsFromState () :string {
  return window.lc.getData('orderedCards')
}
function getSessionOrderedCardsFromState () :string {
  return window.lc.getData('sessionShuffledCards')
}
function updateStudyState (state: string) {
  window.lc.setPersistent('session.studyState', state)
  let session = getSessionFromState()
  window.lc.setPersistent('session.id', session.id)

  let allOrderedCards = getSessionOrderedCardsFromState()
  let newVisibleCards = trimCardsToOnesAwaitingAnswers(allOrderedCards, session)
  let index = getCurrentCardIndex()
  let cards = getVisibleCardsFromState()

  index++
  let newCard = cards[(index % cards.length)]
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
  let originalCardOrder = window.lc.getData('originalCardOrder')
  for (let i = 0; i < originalCardOrder.length; i++) {
    if (originalCardOrder[i] === newCard) {
      newCurrentCard = i
      break
    }
  }
  window.lc.setPersistent('session.currentCard', newCurrentCard)
  updateCardBody(newCard, cards)
  focusOnFlipButton()
}

// If a card is added to a deck during the studying process
export const accountForNewCards = (session: StudySession, cards: string) : StudySession => {
  let count = 0
  let startingLength = session.studyState.length
  let targetLength = cards.length
  while (session.studyState.length < targetLength) {
    session.studyState += '_'
    session.ordering += String.fromCharCode(startingLength + count)
    window.lc.setPersistent('session.studyState', session.studyState)
    window.lc.setPersistent('session.ordering', session.ordering)
    window.lc.setPersistent('session.id', session.id)
    count++
  }
  return session
}

export const resetSession = async () => {
  let session = getSessionFromState()
  await deleteStudySessionAPI(session.id)
  let deck = window.lc.getData('deck')
  await createStudySessionAndNavigate(deck.id)
}

export const studyWrongAnswers = async () => {
  let session = getSessionFromState()
  await deleteStudySessionAPI(session.id)
  let deck = window.lc.getData('deck')
  let studyState = convertRightToSkipsAndWrongsToUnanswered(session.studyState)

  await createStudySessionAndNavigate(deck.id, { studyState, ordering: session.ordering })
}

function convertRightToSkipsAndWrongsToUnanswered (state: string) {
  let rightsToSkips = state.split(RIGHT).join(SKIP)
  return rightsToSkips.split(WRONG).join(NOT_ANSWERED)
}

export const getNumberRight = () => {
  let session = getSessionFromState()
  let state = session.studyState
  let count = 0
  for (let i = 0; i < state.length; i++) {
    if (state[i] === RIGHT) count++
  }
  return count
}

export const getNumberWrong = () => {
  let session = getSessionFromState()
  let state = session.studyState
  let count = 0
  for (let i = 0; i < state.length; i++) {
    if (state[i] === WRONG) count++
  }
  return count
}

function getActiveCardIndexInStudySession () {
  let activeId = window.lc.getData('activeCardId')
  let cards = getSessionOrderedCardsFromState()
  return cards.indexOf(activeId)
}
function getCurrentCardIndex () {
  let currentId = window.lc.getData('activeCardId')
  let cards = window.lc.getData('orderedCards')
  for (let i = 0; i < cards.length; i++) {
    if (cards[i] === currentId) {
      return i
    }
  }
}
export const markRight = () => {
  let cardIndex = getActiveCardIndexInStudySession()
  let state = getSessionFromState().studyState
  let asArray = state.split('')
  asArray[cardIndex] = RIGHT
  let newState = asArray.join('')
  updateStudyState(newState)
}
export const markWrong = () => {
  // Get session state, modify card to wrong, then go to the next card that works
  // Push changed to session state to "persistent changes"
  // If it's the last card, show menu of if they want to study wrong ones or stop
  let cardIndex = getActiveCardIndexInStudySession()
  let state = getSessionFromState().studyState
  let asArray = state.split('')
  asArray[cardIndex] = WRONG
  let newState = asArray.join('')
  updateStudyState(newState)
}
