const { html } = require('lit-html/lit-html')
const studyView = require('./components/study-view')
require('./key-commands')
const { hasImage, getPresentFontSize } = require('../deck/helper')

module.exports = (data) => html`
     ${studyView(data.activeCardId, data.orderedCards, hasImage(), data.showingAnswer, getPresentFontSize())}
`
