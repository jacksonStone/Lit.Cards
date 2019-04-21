const { setEditorData } = require('abstract/editor')
const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
const { getCardBody } = require('logic/cardBodies')

resetAllKeyBindings()

async function updateCardBody (id) {
  const cardBody = await getCardBody(undefined, id)
  window.lc.setData('cardBody', cardBody)
  window.lc.setData('showingAnswer', false)
  updateEditorData()
}

function updateEditorData () {
  const getData = window.lc.getData
  const cardBody = getData('cardBody')
  const showingAnswer = getData('showingAnswer')
  if (showingAnswer) {
    // Show answer
    setEditorData(cardBody.back)
  } else {
    setEditorData(cardBody.front)
  }
}

function getCurrentCardIndex () {
  const currentId = window.lc.getData('activeCardId')
  const cards = window.lc.getData('cards')
  let currentIndex
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === currentId) {
      currentIndex = i
      break
    }
  }
  return currentIndex
}

function rightAction () {
  const showingAnswer = window.lc.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('RIGHT')
}

function leftAction () {
  const showingAnswer = window.lc.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('LEFT')
}

function downAction () {
  let index = getCurrentCardIndex()
  const cards = window.lc.getData('cards')
  index++
  const newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function upAction () {
  let index = getCurrentCardIndex()
  const cards = window.lc.getData('cards')
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function spaceAction () {
  const showingAnswer = window.lc.getData('showingAnswer')
  window.lc.setData('showingAnswer', !showingAnswer)
  updateEditorData()
}

function iAction () {
  const hasImage = window.lc.getData('cardBody.hasImage')
  if (hasImage) return
  window.document.getElementById('image-upload').click()
}
function rAction () {
  const hasImage = window.lc.getData('cardBody.hasImage')
  if (!hasImage) return
  window.lc.setData('cardBody.hasImage', false)
}

listenForCMDKey('KeyS', () => {
  console.log('CMD + S')
})

listenForKey('Space', spaceAction)
listenForKey('ArrowUp', upAction)
listenForKey('KeyI', iAction)
listenForKey('KeyR', rAction)
listenForKey('ArrowDown', downAction)
listenForKey('ArrowLeft', leftAction)
listenForKey('ArrowRight', rightAction)
