const { listenForKey, resetAllKeyBindings } = require('abstract/keyboard')
const {
  flipCard,
  previousCard,
  nextCard
} = require('../deck/helper')
const {
  markRight,
  markWrong
} = require('./helper')

resetAllKeyBindings()
listenForKey('Space', flipCard)
listenForKey('ArrowUp', previousCard)
listenForKey('ArrowDown', nextCard)
listenForKey('ArrowLeft', markWrong)
listenForKey('ArrowRight', markRight)
