const { renderPage } = require('../ui/globals')
const content = require('../ui/page-content/deck')
const { initCommands } = require('../ui/page-content/deck/key-commands')
const { initEditor } = require('abstract/editor')
const { runNextRender } = require('abstract/rendering-meta')
const { getParam } = require('abstract/url')
const { defaultDarkMode } = require('abstract/darkmode')
const { fetchUser } = require('logic/user')
const { getCardBody, getCardBodyForEmptyState } = require('logic/card-bodies')
const { getStudySession } = require('logic/study')
const { intToChar } = require('shared/char-encoding')
const { getDeck, handleEditorTextChange, refreshEditor, getCardsForEmptyState } = require('logic/deck')

;(async () => {
  defaultDarkMode()
  let [user, deck, studySession] = await Promise.all([fetchUser(), getDeck(), getStudySession()])
  const cards = deck.cards || '';
  // For when you navigate from study to edit
  const rawParam = getParam('card')
  const activeCard = rawParam ? window.decodeURIComponent(rawParam) : undefined;
  let firstCardId = activeCard || (cards && cards.length && cards[0])
  let cardBody = await getCardBody(firstCardId, undefined, cards)
  if (!cards || !cardBody) {
    const newId = intToChar(5000);
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
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initEditor(cardBody.front, handleEditorTextChange)
    refreshEditor()
    initCommands()
  })
  renderPage(content)
})()
