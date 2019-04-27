const { html } = require('lit-html/lit-html')
const editView = require('component/edit-view')
require('./key-commands')
const { handleImageUpload, hasImage } = require('./helper')

module.exports = (data) => html`
     ${editView(data.activeCardId, data.cards, handleImageUpload, hasImage())}
`
