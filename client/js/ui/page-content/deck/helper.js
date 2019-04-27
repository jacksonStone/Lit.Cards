const { setEditorData } = require('abstract/editor')
const { getCardBody } = require('logic/cardBodies')
const { renderPreviewImageFromUploadEvent } = require('abstract/file-upload')

function handleImageUpload (e) {
  renderPreviewImageFromUploadEvent(e, 'image-spot')
  const cardId = _getCurrentCardId()
  if (showingAnswer()) {
    window.lc.setPersistent(`cardBody.${cardId}.backHasImage`, true)
  } else {
    window.lc.setPersistent(`cardBody.${cardId}.frontHasImage`, true)
  }
  _refreshEditor()
}

function nextCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('cards')
  index++
  const newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  _updateCardBody(newCard.id)
}

function previousCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('cards')
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  _updateCardBody(newCard.id)
}

function flipCard () {
  const showingAnswer = window.lc.getData('showingAnswer')
  window.lc.setData('showingAnswer', !showingAnswer)
  _updateEditorData()
}

function pickImage () {
  if (hasImage()) return
  window.document.getElementById('image-upload').click()
}

function removeImage () {
  const id = _getCurrentCardId()
  if (!hasImage()) return
  if (showingAnswer()) {
    window.lc.setPersistent(`cardBody.${id}.backHasImage`, false)
    // window.lc.setPersistent(`cardBody.${id}.backImage`, undefined)
  } else {
    window.lc.setPersistent(`cardBody.${id}.frontHasImage`, false)
    // window.lc.setPersistent(`cardBody.${id}.frontImage`, undefined)
  }
  _refreshEditor()
}

function hasImage () {
  let hasImage
  if (showingAnswer()) {
    hasImage = window.lc.getData('cardBody.backHasImage')
  } else {
    hasImage = window.lc.getData('cardBody.frontHasImage')
  }
  return hasImage || false
}

function showingAnswer () {
  return window.lc.getData('showingAnswer') || false
}

function mergeWithChanges (cardBody, id) {
  const changes = window.lc.getData(`changes.cardBody.${id}`) || {}
  return Object.assign({}, cardBody, changes)
}

function _flipToQuestionSide () {
  window.lc.setData('showingAnswer', false)
}

async function _updateCardBody (id) {
  const cardBody = await getCardBody(undefined, id)
  window.lc.setData('cardBody', cardBody)
  _flipToQuestionSide()
  _refreshEditor()
}
function _refreshEditor () {
  const cardBody = window.lc.getData('cardBody')
  const id = cardBody.id
  const withChangesApplied = mergeWithChanges(cardBody, id)
  window.lc.setData('cardBody', withChangesApplied)
  _updateEditorData()
}
function _updateEditorData () {
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
function _getCurrentCardId () {
  return window.lc.getData('activeCardId')
}
function _getCurrentCardIndex () {
  const currentId = _getCurrentCardId()
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

module.exports = {
  removeImage,
  pickImage,
  flipCard,
  previousCard,
  nextCard,
  handleImageUpload,
  hasImage
}
