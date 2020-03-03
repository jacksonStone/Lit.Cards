let { html } = require('lit')
let studyView = require('./components/study-view')
require('./key-commands')
let { hasImage, getPresentFontSize } = require('logic/deck.ts')

module.exports = (data) => html`
     ${studyView(data.activeCardId, data.orderedCards, hasImage(), data.showingAnswer, getPresentFontSize())}
`
