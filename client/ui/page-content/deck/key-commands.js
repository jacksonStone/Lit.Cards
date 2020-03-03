let { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
let {
  pickImage,
  flipCard,
  previousCard,
  nextCard,
  addNewCard
} = require('logic/deck.ts')

function initCommands () {
  resetAllKeyBindings()

  listenForCMDKey('KeyS', () => {
    addNewCard()
  })
  listenForCMDKey('KeyF', () => {
    flipCard()
  })
  listenForKey('KeyS', addNewCard)
  listenForKey('Space', flipCard)
  listenForKey('ArrowUp', previousCard)
  listenForKey('KeyI', pickImage)
  listenForKey('ArrowDown', nextCard)
}

module.exports = {
  initCommands
}
