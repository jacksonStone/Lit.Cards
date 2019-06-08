const { listenForKey, resetAllKeyBindings, resetKey } = require('abstract/keyboard')
const {
  previousCard,
  nextCard
} = require('../deck/helper')
const {
  flipCard,
  markWrong,
  markRight
} = require('logic/study')

function initKeyCommands () {
  resetAllKeyBindings()
  listenForKey('Space', flipCard)
  listenForKey('ArrowUp', previousCard)
  listenForKey('ArrowDown', nextCard)
  listenForKey('ArrowDown', nextCard)
}

function showingAnswerKeyBindings () {
  listenForKey('ArrowLeft', markWrong)
  listenForKey('ArrowRight', markRight)
}

function showingQuestionKeyBindings () {
  resetKey('ArrowLeft')
  resetKey('ArrowRight')
}

module.exports = {
  initKeyCommands,
  showingAnswerKeyBindings,
  showingQuestionKeyBindings
}
