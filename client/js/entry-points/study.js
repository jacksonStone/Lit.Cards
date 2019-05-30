// TODO:: MAke this not the deck edit page
const { renderPage } = require('../ui/globals')
const { home: homePage } = require('../routes/navigation/pages')
const content = require('../ui/page-content/deck')
const { getCardMapping } = require('../ui/page-content/deck/helper')
const { defaultDarkMode } = require('abstract/darkmode')
const { runNextRender } = require('abstract/rendering-meta')
const { fetchUser } = require('logic/getUser')
const { getCards } = require('logic/cards')
const { getCardBody } = require('logic/cardBodies')
const { getDeck } = require('logic/deck')
const { getStudySession } = require('logic/study')
const { renderPreviewImageWithRawData } = require('abstract/file-upload')

;(async () => {
  // TODO:: User info should determine if in dark mode or not
  defaultDarkMode()
  let [user, studySession] = await Promise.all([fetchUser(), getStudySession()])
  const deckId = studySession.deck
  let [deck, cards] = await Promise.all([getDeck(deckId), getCards(deckId)])
  // TODO::Could do this in one pass, sever can figure out first card
  // TODO:: Base this on currentCard + ordering of session
  let firstCardId = (cards && cards.length && cards[0].id) || undefined
  let cardBody = await getCardBody(deckId, firstCardId)
  if (!cards || !cardBody) {
    return homePage()
  }
  // TODO:: Sort cards here
  window.lc.setData('orderedCards', cards)
  window.lc.setData('deck', deck)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    // TODO::Consider doing this better
    debugger
    if (cardBody.frontHasImage) {
      renderPreviewImageWithRawData(cardBody.frontImage)
    }
  })
  renderPage(content)
})()
