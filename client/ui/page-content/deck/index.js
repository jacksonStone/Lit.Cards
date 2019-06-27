const { html } = require('lit')
const editView = require('./components/edit-view')
require('./key-commands')
const { handleImageUpload, hasImage, getPresentFontSize } = require('logic/deck')

module.exports = (data) => html`
     ${editView(data.activeCardId, data.orderedCards, handleImageUpload, hasImage(), data.showingAnswer, getPresentFontSize())}
`
