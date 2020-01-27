let { html } = require('lit')
let { listenForKey, archiveCurrentKeyBindings, restoreArchivedKeyBindings } = require('abstract/keyboard')
let { addImageDataToImage } = require('abstract/file-upload')
// TODO::Consider reworking deps here
let { getImageData } = require('logic/deck')
let { runNextRender } = require('abstract/rendering-meta')

let _hidePopup = (e) => {
  e.preventDefault()
  restoreArchivedKeyBindings()
  window.lc.setData('showingPopup', false)
}

let showPopup = () => {
  archiveCurrentKeyBindings()
  listenForKey('Escape', _hidePopup)
  window.lc.setData('showingPopup', true)
}
let getPopupWidthAndHeight = function(width){
  if(width > 600) {
    return `
      width: 600px;
      height: 600px;
      margin-top: -300px;
      margin-left: -300px;
    `
  } else {
    return `
      width: ${width + ''}px;
      height: ${width + ''}px;
      margin-top: -${((width/2)|0) + ''}px;
      margin-left: -${((width/2)|0) + ''}px;
    `
  }
}
let popupComponent = () => {
  if (!window.lc.getData('showingPopup')) {
    return null
  }
  runNextRender(() => {
    addImageDataToImage(getImageData(), 'popup-image')
  })
  let width = window.lc.getData('screen.width');
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
    top: 50%;
    left: 50%;
    ${getPopupWidthAndHeight(width)}
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
