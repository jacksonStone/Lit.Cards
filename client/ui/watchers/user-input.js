//TODO:: Maybe have this live in one place
const propName = '_focusingOnText'

function focusingOnTextInput () {
  if (window.document.activeElement === window.document.body) {
    return false
  }
  return isTextField(window.document.activeElement)
}

function isTextField (activeElement) {
  if(activeElement.nodeName === 'INPUT') {
    return true;
  }
  return activeElement.classList.contains('pell-content') || activeElement.id === 'deck-name';
}

function listenToTextSelection () {
    const wasFocusingOnText = window.lc.getData(propName)
    const isFocusingOnText = focusingOnTextInput()
    if(isFocusingOnText === wasFocusingOnText) {
      return
    }
    window.lc.setData(propName, isFocusingOnText)
}

module.exports = () => {
  window.document.addEventListener('focusin', (e) => {
    listenToTextSelection()
  })
  window.document.addEventListener('focusout', (e) => {
    listenToTextSelection()
  })
}

