const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
const {
  removeImage,
  pickImage,
  flipCard,
  previousCard,
  nextCard
} = require('./helper')

resetAllKeyBindings()

listenForCMDKey('KeyS', () => {
  console.log('CMD + S')
})

listenForKey('Space', flipCard)
listenForKey('ArrowUp', previousCard)
listenForKey('KeyI', pickImage)
listenForKey('KeyR', removeImage)
listenForKey('ArrowDown', nextCard)
