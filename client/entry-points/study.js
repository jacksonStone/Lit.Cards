let { renderPage } = require('../ui/globals')
let { home: homePage } = require('../routes/navigation/pages')
let content = require('../ui/page-content/study-session')
let { initKeyCommands } = require('../ui/page-content/study-session/key-commands')
let { defaultDarkMode } = require('abstract/darkmode')
let { runNextRender } = require('abstract/rendering-meta')
let { fetchUser } = require('logic/user')
let { getCardBody } = require('logic/card-bodies')
let { getDeck } = require('logic/deck')
let { getStudySession, sortCardsBySession, trimCardsToOnesAwaitingAnswers, accountForNewCards } = require('logic/study')

;(async () => {
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  let deckId = studySession.deck
  let [deck] = await Promise.all([getDeck(deckId)])
  let cards = deck.cards || '';
  if (studySession) {
    studySession = accountForNewCards(studySession, cards)
  }
  let firstCardId = (cards && cards.length && cards[studySession.currentCard || 0]) || undefined
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
