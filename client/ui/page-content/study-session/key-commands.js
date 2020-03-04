import { listenForKey, resetAllKeyBindings, resetKey } from '../../../browser-abstractions/keyboard';
import { previousCard, nextCard } from 'logic/deck.ts';
import { flipCard, markWrong, markRight, recordTheyAreTabNavigating } from '../../../business-logic/study';

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

export default {
  initKeyCommands,
  showingAnswerKeyBindings,
  showingQuestionKeyBindings
};
