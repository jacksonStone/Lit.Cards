const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
const {
  pickImage,
  flipCard,
  previousCard,
  nextCard,
  addNewCard
} = require('logic/deck')

function initCommands () {
  resetAllKeyBindings()

  listenForCMDKey('KeyS', () => {
    console.info('CMD + S')
    addNewCard()
  })
  listenForCMDKey('KeyF', () => {
    console.info('CMD + F')
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
