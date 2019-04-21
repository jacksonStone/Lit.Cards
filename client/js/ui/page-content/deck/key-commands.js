const { setEditorData } = require('abstract/editor')
const { listenForKey, resetAllKeyBindings, listenForCMDKey } = require('abstract/keyboard')
const { getCardBody } = require('logic/cardBodies')

resetAllKeyBindings()

async function updateCardBody (id) {
  const cardBody = await getCardBody(undefined, id)
  window.sn.setData('cardBody', cardBody)
  window.sn.setData('showingAnswer', false)
  updateEditorData()
}

function updateEditorData () {
  const getData = window.sn.getData
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
  const currentId = window.sn.getData('activeCardId')
  const cards = window.sn.getData('cards')
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
  const showingAnswer = window.sn.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('RIGHT')
}

function leftAction () {
  const showingAnswer = window.sn.getData('showingAnswer')
  if (!showingAnswer) return
  console.log('LEFT')
}

function downAction () {
  let index = getCurrentCardIndex()
  const cards = window.sn.getData('cards')
  index++
  const newCard = cards[(index % cards.length)]
  window.sn.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function upAction () {
  let index = getCurrentCardIndex()
  const cards = window.sn.getData('cards')
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.sn.setData('activeCardId', newCard.id)
  updateCardBody(newCard.id)
}

function spaceAction () {
  const showingAnswer = window.sn.getData('showingAnswer')
  window.sn.setData('showingAnswer', !showingAnswer)
  updateEditorData()
}

listenForCMDKey('KeyS', () => {
  console.log('CMD + S')
})

listenForKey('Space', spaceAction)
listenForKey('ArrowUp', upAction)
listenForKey('ArrowDown', downAction)
listenForKey('ArrowLeft', leftAction)
listenForKey('ArrowRight', rightAction)
