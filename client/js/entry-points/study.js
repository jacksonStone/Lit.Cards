// TODO:: MAke this not the deck edit page
const { renderPage } = require('../ui/globals')
const { home: homePage } = require('../routes/navigation/pages')
const content = require('../ui/page-content/study-session')
const { getCardMapping } = require('../ui/page-content/deck/helper')
const { defaultDarkMode } = require('abstract/darkmode')
const { runNextRender } = require('abstract/rendering-meta')
const { fetchUser } = require('logic/getUser')
const { getCards } = require('logic/cards')
const { getCardBody } = require('logic/cardBodies')
const { getDeck } = require('logic/deck')
const { getStudySession, sortCardsBySession, trimCardsToOnesAwaitingAnswers } = require('logic/study')
const { renderPreviewImageWithRawData } = require('abstract/file-upload')

;(async () => {
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  const deckId = studySession.deck
  let [deck, cards] = await Promise.all([getDeck(deckId), getCards(deckId)])
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
  runNextRender(() => {
    // TODO::Consider doing this better
    if (cardBody.frontHasImage) {
      renderPreviewImageWithRawData(cardBody.frontImage)
    }
  })
  renderPage(content)
})()
