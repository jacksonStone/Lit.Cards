let { renderPage } = require('../ui/globals')
let content = require('../ui/page-content/deck')
let { initCommands } = require('../ui/page-content/deck/key-commands')
let { initEditor } = require('abstract/editor')
let { runNextRender } = require('abstract/rendering-meta')
let { getParam } = require('abstract/url')
let { defaultDarkMode } = require('abstract/darkmode')
let { fetchUser } = require('logic/user')
let { getCardBody } = require('logic/card-bodies')
let { getStudySession } = require('logic/study')
let { getDeck, handleEditorTextChange, refreshEditor } = require('logic/deck')

;(async () => {
  defaultDarkMode()
  let [user, deck, studySession] = await Promise.all([fetchUser(), getDeck(), getStudySession()])
  let cards = deck.cards || ''
  // For when you navigate from study to edit
  let rawParam = getParam('card')
  let activeCard = rawParam ? window.decodeURIComponent(rawParam) : undefined
  let firstCardId = activeCard || (cards && cards.length && cards[0])
  let cardBody = await getCardBody(firstCardId, undefined, cards)
  // WE WANT TO CREATE FIRST CARD ON THE SERVER
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
