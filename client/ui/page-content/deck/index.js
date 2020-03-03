let { html } = require('lit')
let editView = require('./components/edit-view')
require('./key-commands')
let { handleImageUpload, hasImage, getPresentFontSize } = require('logic/deck.ts')

module.exports = (data) => html`
     ${editView(data.activeCardId, data.orderedCards, handleImageUpload, hasImage(), data.showingAnswer, getPresentFontSize())}
`
