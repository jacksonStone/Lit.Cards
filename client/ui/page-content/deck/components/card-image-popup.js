const { html } = require('lit')
const { listenForKey, archiveCurrentKeyBindings, restoreArchivedKeyBindings } = require('../../../../browser-abstractions/keyboard')
const { addImageDataToImage } = require('../../../../browser-abstractions/file-upload')
// TODO::Consider reworking deps here
const { getImageData } = require('../helper')
const { runNextRender } = require('../../../../browser-abstractions/rendering-meta')

const _hidePopup = (e) => {
  e.preventDefault()
  restoreArchivedKeyBindings()
  window.lc.setData('showingPopup', false)
}

const showPopup = () => {
  archiveCurrentKeyBindings()
  listenForKey('Escape', _hidePopup)
  window.lc.setData('showingPopup', true)
}

const popupComponent = () => {
  if (!window.lc.getData('showingPopup')) {
    return null
  }
  runNextRender(() => {
    addImageDataToImage(getImageData(), 'popup-image')
  })
  return html`<div id="overlay" style="
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    "
    @click=${_hidePopup}
    >
    <div class="popup" style="
    position: fixed;
    width: 600px;
    height: 600px;
    top: 50%;
    left: 50%;
    margin-top: -300px;
    margin-left: -300px;
    padding: 5px;">
    <img id="popup-image" 
    style="
    width:auto;
    border: #ddd 2px solid;
    height: auto;
    position:absolute;
    top:0;
    bottom:0;
    margin:auto;"/>
</div></div>`
}

module.exports = {
  popupComponent,
  showPopup
}
