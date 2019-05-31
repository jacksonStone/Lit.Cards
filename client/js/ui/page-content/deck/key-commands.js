const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
const {
  removeImage,
  pickImage,
  flipCard,
  previousCard,
  nextCard,
  addNewCard
} = require('./helper')

resetAllKeyBindings()

listenForCMDKey('KeyS', () => {
  // console.log('CMD + S')
})

listenForKey('KeyN', addNewCard)
listenForKey('Space', flipCard)
listenForKey('ArrowUp', previousCard)
listenForKey('KeyI', pickImage)
listenForKey('KeyR', removeImage)
listenForKey('ArrowDown', nextCard)
