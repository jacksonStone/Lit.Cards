import { listenForKey, resetAllKeyBindings, listenForCMDKey } from 'abstract/keyboard';
import { pickImage, flipCard, previousCard, nextCard, addNewCard } from 'logic/deck.ts';

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

export default {
  initCommands
};
