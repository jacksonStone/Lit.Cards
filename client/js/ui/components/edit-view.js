const { html } = require('lit-html/lit-html')
const editor = require('component/card-editor')
const cardEditStack = require('component/card-edit-stack')
const { renderPreviewImageFromUploadEvent } = require('abstract/file-upload')

function addImage (e) {
  renderPreviewImageFromUploadEvent(e, 'image-spot')
}

module.exports = (cardId, cards) => html`
  <div class="grid-container">
        <div class="grid-row">
            <div class="grid-col-9">
                ${editor(addImage)}
            </div>
            <div class="grid-col-3">
                ${cardEditStack(cardId, cards)}
            </div>
        </div>
</div>

`
