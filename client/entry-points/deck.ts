declare global {
  interface Window {
    lc: any;
  }
}
let { renderPage } = require('../ui/globals')
let content = require('../ui/page-content/deck')
let { initCommands } = require('../ui/page-content/deck/key-commands')
let { initEditor } = require('abstract/editor')
let { runNextRender } = require('abstract/rendering-meta')
let { getParam } = require('abstract/url')
let { defaultDarkMode } = require('abstract/darkmode')
let { fetchUser } = require('logic/user')
let { getCardBody, getCardBodyForEmptyState } = require('logic/card-bodies')
let { getStudySession } = require('logic/study')
const { getDeckLogic, handleEditorTextChange, refreshEditor } = require('logic/deck.ts')

;(async () => {
  defaultDarkMode()
  let [user, deck, studySession] = await Promise.all([fetchUser(), getDeckLogic(), getStudySession()])
  let cards = deck.cards || ''
  const deck2 = await getDeckLogic();
  // For when you navigate from study to edit
  let rawParam = getParam('card')


  window.lc.setData('deck.ts.ts', deck)
  let activeCard: string = rawParam ? window.decodeURIComponent(rawParam) : undefined
  let firstCardId: string = activeCard || (cards && cards.length && cards[0])
  let cardBody: any;
  try {
    cardBody = await getCardBody(firstCardId, undefined, cards)
  } catch (e) {
    if (deck.cards.length === 1) {
      // We probably failed to add new card, due to server restart or some such
      cardBody = getCardBodyForEmptyState(firstCardId)
    }
  }

  if (!cardBody) {
    // In case something went sideways
    window.location.href = '/'
  }
  window.lc.setData('orderedCards', cards)
  window.lc.setData('activeCardId', firstCardId)
  window.lc.setData('user', user)
  window.lc.setData('session', studySession)
  window.lc.setData('showingAnswer', false)
  window.lc.setData(`cardBody.${firstCardId}`, cardBody)
  runNextRender(() => {
    initCommands()
    initEditor(cardBody.front, handleEditorTextChange)
    refreshEditor()
  })
  renderPage(content)
})()

export {}
