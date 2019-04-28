const { html } = require('lit-html/lit-html')
const { stopListeningForKey, listenForKey } = require('abstract/keyboard')
const { addImageDataToImage } = require('abstract/file-upload')
// TODO::Consider reworking deps here
const { getImageData } = require('../helper')
const { runNextRender } = require('abstract/rendering-meta')

const _hidePopup = (e) => {
  e.preventDefault()
  stopListeningForKey('Escape')
  window.lc.setData('showingPopup', false)
}

const showPopup = () => {
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
    background-color: rgba(240,240,240,.9);
    "
    @click=${_hidePopup}
    >
    <div class="popup" style="
    position: fixed;
    width: 800px;
    height: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -300px;
    margin-left: -400px;
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
