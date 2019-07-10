const { listenForKey, resetAllKeyBindings, resetKey } = require('../../../browser-abstractions/keyboard')
const {
  previousCard,
  nextCard
} = require('logic/deck')
const {
  flipCard,
  markWrong,
  markRight,
  recordTheyAreTabNavigating
} = require('../../../business-logic/study')

function initKeyCommands () {
  resetAllKeyBindings()
  listenForKey('Space', flipCard)
  listenForKey('ArrowUp', previousCard)
  listenForKey('ArrowDown', nextCard)
  listenForKey('Tab', recordTheyAreTabNavigating)
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
