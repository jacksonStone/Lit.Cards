const { listenForKey, resetAllKeyBindings } = require('abstract/keyboard')
const {
  flipCard,
  previousCard,
  nextCard
} = require('../deck/helper')

resetAllKeyBindings()
listenForKey('Space', flipCard)
listenForKey('ArrowUp', previousCard)
listenForKey('ArrowDown', nextCard)
