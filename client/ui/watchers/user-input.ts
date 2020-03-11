//TODO:: Maybe have this live in one place
let propName = '_focusingOnText'

function focusingOnTextInput () {
  if (window.document.activeElement === window.document.body) {
    return false
  }
  return isTextField(window.document.activeElement)
}

function isTextField (activeElement: Element) {
  if(activeElement.nodeName === 'INPUT') {
    return true;
  }
  return activeElement.classList.contains('pell-content') || activeElement.id === 'deck-name';
}

function listenToTextSelection () {
    let wasFocusingOnText = <boolean>window.lc.getData(propName)
    let isFocusingOnText = focusingOnTextInput()
    if(isFocusingOnText === wasFocusingOnText) {
      return
    }
    window.lc.setData(propName, isFocusingOnText)
}

export default () => {
  window.document.addEventListener('focusin', (e) => {
    listenToTextSelection()
  })
  window.document.addEventListener('focusout', (e) => {
    listenToTextSelection()
  })
};

