const { renderPage } = require('../ui/globals')
const { home: homePage } = require('../routes/navigation/pages')
const content = require('../ui/page-content/study-session')
const { initKeyCommands } = require('../ui/page-content/study-session/key-commands')
const { defaultDarkMode } = require('abstract/darkmode')
const { runNextRender } = require('abstract/rendering-meta')
const { fetchUser } = require('logic/user')
const { getCardBody } = require('logic/card-bodies')
const { getDeck, getCardMapping } = require('logic/deck')
const { getStudySession, sortCardsBySession, trimCardsToOnesAwaitingAnswers, accountForNewCards } = require('logic/study')

;(async () => {
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  const deckId = studySession.deck
  let [deck] = await Promise.all([getDeck(deckId)])
  const cards = deck.cards ? deck.cards.split("").map((char) => ({id: char})) : [];
  if (studySession) {
    studySession = accountForNewCards(studySession, cards)
  }
  let firstCardId = (cards && cards.length && cards[studySession.currentCard || 0].id) || undefined
  let sessionOrderedCards = sortCardsBySession(cards, studySession)
  let visibleCards = trimCardsToOnesAwaitingAnswers(sessionOrderedCards, studySession)
  let cardBody = await getCardBody(firstCardId, deckId, visibleCards)
  if (!cards || !cardBody) {
    return homePage()
  }
  window.lc.setData('orderedCards', visibleCards)
  window.lc.setData('sessionShuffledCards', sessionOrderedCards)
  window.lc.setData('session', studySession)
  window.lc.setData('deck', deck)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('originalCardOrder', cards)
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(initKeyCommands)
  renderPage(content)
})()
