const { html } = require('lit-html/lit-html')
const editView = require('component/edit-view')
require('./key-commands')
const { renderPreviewImageFromUploadEvent } = require('abstract/file-upload')

function addImage (e) {
  renderPreviewImageFromUploadEvent(e, 'image-spot')
  window.lc.setData('cardBody.hasImage', true)
}

module.exports = (data) => html`
     ${editView(data.activeCardId, data.cards, addImage, data.cardBody && data.cardBody.hasImage)}
`
