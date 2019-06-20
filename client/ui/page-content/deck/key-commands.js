const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('../../../browser-abstractions/keyboard')
const {
  pickImage,
  flipCard,
  previousCard,
  nextCard,
  addNewCard
} = require('./helper')

function initCommands () {
  resetAllKeyBindings()

  listenForCMDKey('KeyS', () => {
    // console.info('CMD + S')
  })
  listenForKey('KeyN', addNewCard)
  listenForKey('Space', flipCard)
  listenForKey('ArrowUp', previousCard)
  listenForKey('KeyI', pickImage)
  // We use the RKey for "restoring State"
  // listenForKey('KeyR', removeImage)
  listenForKey('ArrowDown', nextCard)
}

module.exports = {
  initCommands
}