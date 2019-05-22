const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { handleEditorTextChange, getCardMapping } = require('../ui/page-content/deck/helper')
const { initEditor } = require('abstract/editor')
const { runNextRender } = require('abstract/rendering-meta')
const { defaultDarkMode } = require('abstract/darkmode')
const { fetchUser } = require('logic/getUser')
const { getCards, getCardsForEmptyState } = require('logic/cards')
const { getCardBody, getCardBodyForEmptyState } = require('logic/cardBodies')
const { getDeck } = require('logic/deck')
;(async () => {
  // TODO:: User info should determine if in dark mode or not
  defaultDarkMode()
  let [user, cards, cardBody, deck] = await Promise.all([fetchUser(), getCards(), getCardBody(), getDeck()])
  if (!cards || !cardBody) {
    const newId = window.lc.generateNewId()
    cardBody = getCardBodyForEmptyState(newId)
    cards = getCardsForEmptyState(newId)
  }
  const firstCardId = (cards && cards.length && cards[0].id) || undefined
  window.lc.setData('orderedCards', cards)
  window.lc.setData('deck', deck)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('showingAnswer', false)
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initEditor(cardBody.front, handleEditorTextChange)
  })
  renderPage(content)
})()
