const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { initCommands } = require('../ui/page-content/deck/key-commands')
const { handleEditorTextChange, getCardMapping, refreshEditor } = require('../ui/page-content/deck/helper')
const { initEditor } = require('../browser-abstractions/editor')
const { runNextRender } = require('../browser-abstractions/rendering-meta')
const { getParam } = require('../browser-abstractions/url')
const { defaultDarkMode } = require('../browser-abstractions/darkmode')
const { fetchUser } = require('../business-logic/user')
const { getCards, getCardsForEmptyState } = require('../business-logic/cards')
const { getCardBody, getCardBodyForEmptyState } = require('../business-logic/card-bodies')
const { getStudySession } = require('../business-logic/study')
const { getDeck } = require('../business-logic/deck')
// TODO::Consider pulling this from a URL

;(async () => {
  // TODO:: User info should determine if in dark mode or not
  defaultDarkMode()
  let [user, cards, deck, studySession] = await Promise.all([fetchUser(), getCards(), getDeck(), getStudySession()])
  // For when you navigate from study to edit
  const activeCard = getParam('card')
  // TODO::Could do this in one pass, sever can figure out first card
  let firstCardId = activeCard || (cards && cards.length && cards[0].id) || undefined
  let cardBody = await getCardBody(firstCardId)
  if (!cards || !cardBody) {
    const newId = window.lc.generateNewId()
    firstCardId = newId
    cardBody = getCardBodyForEmptyState(newId)
    cards = getCardsForEmptyState(newId)
  }
  window.lc.setData('orderedCards', cards)
  window.lc.setData('deck', deck)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('session', studySession)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initEditor(cardBody.front, handleEditorTextChange)
    refreshEditor()
    initCommands()
  })
  renderPage(content)
})()
