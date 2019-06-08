const { listenForKey, resetAllKeyBindings } = require('abstract/keyboard')
const { storeAllState, retrieveStateStored } = require('abstract/browser-storage')
const {
  previousCard,
  nextCard
} = require('../deck/helper')
const {
  flipCard
} = require('logic/study')

resetAllKeyBindings()
listenForKey('Space', flipCard)
listenForKey('ArrowUp', previousCard)
listenForKey('ArrowDown', nextCard)
listenForKey('ArrowDown', nextCard)
// we set these dynamically on flip in logic
// listenForKey('ArrowLeft', markWrong)
// listenForKey('ArrowRight', markRight)
