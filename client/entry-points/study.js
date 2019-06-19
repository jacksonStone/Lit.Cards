const { renderPage } = require('../ui/globals')
const { home: homePage } = require('../routes/navigation/pages')
const content = require('../ui/page-content/study-session')
const { initKeyCommands } = require('../ui/page-content/study-session/key-commands')
const { getCardMapping } = require('../ui/page-content/deck/helper')
const { defaultDarkMode } = require('../browser-abstractions/darkmode')
const { runNextRender } = require('../browser-abstractions/rendering-meta')
const { fetchUser } = require('../business-logic/user')
const { getCards } = require('../business-logic/cards')
const { getCardBody } = require('../business-logic/card-bodies')
const { getDeck } = require('../business-logic/deck')
const { getStudySession, sortCardsBySession, trimCardsToOnesAwaitingAnswers, accountForNewCards } = require('../business-logic/study')

;(async () => {
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  const deckId = studySession.deck
  let [deck, cards] = await Promise.all([getDeck(deckId), getCards(deckId)])
  if (studySession) {
    studySession = accountForNewCards(studySession, cards)
  }
  let firstCardId = (cards && cards.length && cards[studySession.currentCard || 0].id) || undefined
  let sessionOrderedCards = sortCardsBySession(cards, studySession)
  let visibleCards = trimCardsToOnesAwaitingAnswers(sessionOrderedCards, studySession)
  let cardBody = await getCardBody(firstCardId, deckId)
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
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(initKeyCommands)
  renderPage(content)
})()
