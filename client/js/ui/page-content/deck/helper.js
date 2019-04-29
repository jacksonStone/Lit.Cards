const { setEditorData } = require('abstract/editor')
const { getCardBody } = require('logic/cardBodies')
const { renderPreviewImageWithRawData, getFileData, getImageAtDifferentSize } = require('abstract/file-upload')

// TODO::Make it so when you swap cards where the swapped to card has no image you make sure popup closes
async function handleImageUpload (e) {
  const imageData = await getFileData(e)
  const largeImageSize = [600, 600]
  const thumbnailSize = [60, 60]
  let imagePreview
  if (showingAnswer()) {
    const [largeImage] = await getImageAtDifferentSize(imageData, largeImageSize)
    setPersistentForCardBody('backHasImage', true)
    setPersistentForCardBody('backImage', largeImage)
    imagePreview = largeImage
  } else {
    const [largeImage, thumbnail] = await getImageAtDifferentSize(imageData, largeImageSize, thumbnailSize)
    setPersistentForCardBody('frontHasImage', true)
    setPersistentForCard('image', thumbnail)
    setPersistentForCardBody('frontImage', largeImage)
    imagePreview = largeImage
  }
  renderPreviewImageWithRawData(imagePreview, 'image-spot')

  _refreshEditor()
}

function setPersistentForCardBody (key, value) {
  const cardId = _getCurrentCardId()
  const changeKey = `cardBody.${cardId}.${key}`
  window.lc.setPersistent(changeKey, value)
}
function setPersistentForCard (key, value) {
  const cardId = _getCurrentCardId()
  const changeKey = `card.${cardId}.${key}`
  window.lc.setPersistent(changeKey, value)
}

function handleEditorTextChange (newText) {
  // TODO:: Handle text resize
  // TODO:: Store things for CMD+Z
  console.log(arguments)
  if (showingAnswer()) {
    return setPersistentForCardBody('back', newText)
  }
  setPersistentForCardBody('front', newText)
}

function getImageData () {
  if (!hasImage()) return ''
  if (showingAnswer()) {
    return window.lc.getData('cardBody.backImage')
  }
  return window.lc.getData('cardBody.frontImage')
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
  _refreshEditor()
}

function pickImage () {
  if (hasImage()) return
  window.document.getElementById('image-upload').click()
}

function removeImage () {
  if (!hasImage()) return
  if (showingAnswer()) {
    setPersistentForCardBody('backHasImage', false)
    setPersistentForCardBody('backImage', undefined)
  } else {
    setPersistentForCardBody('frontHasImage', false)
    setPersistentForCardBody('frontImage', undefined)
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

function addNewCard () {
  const allCards = window.lc.getData('cards')
  const cardCount = allCards.length
  // TODO:: Maybe want to do more here
  const newId = generateNewId(16)

  const changeKey = `card.${cardCount}`
  // Get current deck?
  window.lc.setPersistent(changeKey, { id: newId, isNew: true })
}

function generateNewId (length) {
  const charArray = []
  const possibleValues = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (let i = 0; i < length; i++) {
    charArray.push(possibleValues[((Math.random() * possibleValues.length) | 0)])
  }
  return charArray.join('')
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
  if (hasImage()) {
    renderPreviewImageWithRawData(getImageData(), 'image-spot')
  }
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
  addNewCard,
  previousCard,
  nextCard,
  handleImageUpload,
  hasImage,
  getImageData,
  handleEditorTextChange
}
