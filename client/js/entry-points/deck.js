const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { initCommands } = require('../ui/page-content/deck/key-commands')
const { handleEditorTextChange, getCardMapping } = require('../ui/page-content/deck/helper')
const { initEditor } = require('abstract/editor')
const { runNextRender } = require('abstract/rendering-meta')
const { getParam } = require('abstract/url')
const { defaultDarkMode } = require('abstract/darkmode')
const { fetchUser } = require('logic/getUser')
const { getCards, getCardsForEmptyState } = require('logic/cards')
const { getCardBody, getCardBodyForEmptyState } = require('logic/cardBodies')
const { getDeck } = require('logic/deck')
// TODO::Consider pulling this from a URL
const { renderPreviewImageWithRawData } = require('abstract/file-upload')

;(async () => {
  // TODO:: User info should determine if in dark mode or not
  defaultDarkMode()
  let [user, cards, deck] = await Promise.all([fetchUser(), getCards(), getDeck()])
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
  window.lc.setData('showingAnswer', false)
  window.lc.setData('card', getCardMapping(cards))
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initEditor(cardBody.front, handleEditorTextChange)
    initCommands()
  })
  renderPage(content)
})()
