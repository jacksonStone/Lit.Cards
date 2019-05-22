const { setEditorData, getFontSize, getTextOnly } = require('abstract/editor')
const { getCardBody } = require('logic/cardBodies')
const { renderPreviewImageWithRawData, getFileData, getImageAtDifferentSize } = require('abstract/file-upload')
const { runNextRender } = require('abstract/rendering-meta')

// TODO::Make it so when you swap cards where the swapped to card has no image you make sure popup closes
async function handleImageUpload (e) {
  const imageData = await getFileData(e)
  const largeImageSize = [600, 600]
  const thumbnailSize = [120, 120]
  let imagePreview
  if (showingAnswer()) {
    const [largeImage] = await getImageAtDifferentSize(imageData, largeImageSize)
    setPersistentForCardBody('backHasImage', true)
    setPersistentForCardBody('backImage', largeImage)
    imagePreview = largeImage
  } else {
    const [largeImage, thumbnail] = await getImageAtDifferentSize(imageData, largeImageSize, thumbnailSize)
    setPersistentForCardBody('frontHasImage', true)
    setPersistentForCardBody('frontImage', largeImage)
    setPersistentForCard('image', thumbnail)
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
function updateFontSizeIfNecessary (oldCardBody, newText) {
  if (!oldCardBody) return
  const ratioOfWatermarkBeforeDownsize = 1.3
  if (showingAnswer()) {
    if (getTextOnly(newText).length === 0) {
      return setPersistentForCardBody('backFontSize', 1)
    }

    if (oldCardBody.backWatermark &&
      (oldCardBody.backWatermark / newText.length > ratioOfWatermarkBeforeDownsize) &&
      oldCardBody.backFontSize > 1) {
      // Reset watermark
      setPersistentForCardBody('frontWatermark', newText.length)
      return setPersistentForCardBody('backFontSize', oldCardBody.backFontSize - 1)
    }
    const newFontSize = getFontSize(oldCardBody.backFontSize || 1)
    if (newFontSize !== oldCardBody.backFontSize) {
      setPersistentForCardBody('backFontSize', newFontSize)
    }
  } else {
    if (getTextOnly(newText).length === 0) {
      return setPersistentForCardBody('frontFontSize', 1)
    }
    if (oldCardBody.frontWatermark &&
      oldCardBody.frontWatermark / newText.length > ratioOfWatermarkBeforeDownsize &&
      oldCardBody.frontFontSize > 1) {
      // Reset watermark
      setPersistentForCardBody('frontWatermark', newText.length)
      return setPersistentForCardBody('frontFontSize', oldCardBody.frontFontSize - 1)
    }
    const newFontSize = getFontSize(oldCardBody.frontFontSize || 1)
    if (newFontSize !== oldCardBody.frontFontSize) {
      setPersistentForCardBody('frontFontSize', newFontSize)
    }
  }
}
function getPresentFontSize () {
  const cardBody = _getCurrentCardBody()
  if (!cardBody) return 1
  if (showingAnswer()) {
    return cardBody.backFontSize
  }
  return cardBody.frontFontSize
}

function handleEditorTextChange (newText) {
  console.log(arguments)
  const oldCardBody = JSON.parse(JSON.stringify(_getCurrentCardBody()))
  runNextRender(() => {
    updateFontSizeIfNecessary(oldCardBody, newText)
  })
  if (showingAnswer()) {
    if (newText.length > (oldCardBody.backWatermark || 0)) {
      setPersistentForCardBody('backWatermark', newText.length)
    }
    return setPersistentForCardBody('back', newText)
  }
  if (newText.length > (oldCardBody.frontWatermark || 0)) {
    setPersistentForCardBody('frontWatermark', newText.length)
  }
  setPersistentForCardBody('front', newText)
}

function getImageData () {
  if (!hasImage()) return ''
  const cardBody = _getCurrentCardBody()
  if (showingAnswer()) {
    return cardBody.backImage
  }
  return cardBody.frontImage
}

function nextCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('orderedCards')
  index++
  const newCard = cards[(index % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  _updateCardBody(newCard.id)
}

function removeCard () {
  let index = _getCurrentCardIndex()
  let id = _getCurrentCardId()
  const cards = window.lc.getData('orderedCards')
  cards.splice(index, 1)
  window.lc.setDeleted('card', id)
  window.lc.setDeleted('cardBody', id)
  index--
  const newCard = cards[((index + cards.length) % cards.length)]
  window.lc.setData('activeCardId', newCard.id)
  _updateCardBody(newCard.id)
}

function previousCard () {
  let index = _getCurrentCardIndex()
  const cards = window.lc.getData('orderedCards')
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
    hasImage = window.lc.getData(`cardBody.${_getCurrentCardId()}.backHasImage`)
  } else {
    hasImage = window.lc.getData(`cardBody.${_getCurrentCardId()}.frontHasImage`)
  }
  return hasImage || false
}

function showingAnswer () {
  return window.lc.getData('showingAnswer') || false
}
function getCardMapping (cards) {
  const mapping = {}
  for (let i = 0; i < cards.length; i++) {
    mapping[cards[i].id] = cards[i]
  }
  return mapping
}

function addNewCard () {
  const newId = window.lc.generateNewId()

  const changeKeyCard = `card.${newId}`
  const changeKeyCardBody = `cardBody.${newId}`
  const card = { id: newId, isNew: true }
  const cardBody = { id: newId, isNew: true, front: '', back: '' }
  // Get current deck?
  window.lc.setPersistent(changeKeyCard, card)
  window.lc.setPersistent(changeKeyCardBody, cardBody)
  window.lc.addDataListEntry('orderedCards', card)
  window.lc.setData('activeCardId', newId)
  _flipToQuestionSide()
  _refreshEditor()
}

function _generateNewId (length) {
  const charArray = []
  const possibleValues = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  for (let i = 0; i < length; i++) {
    charArray.push(possibleValues[((Math.random() * possibleValues.length) | 0)])
  }
  return charArray.join('')
}

function updateDeckName(name) {

}

function _flipToQuestionSide () {
  window.lc.setData('showingAnswer', false)
}

async function _updateCardBody (id) {
  _flipToQuestionSide()
  const currentCardBody = window.lc.getData('cardBody.' + id)
  if (currentCardBody) {
    _refreshEditor()
    return
  }
  const cardBody = await getCardBody(undefined, id)
  window.lc.setData('cardBody.' + id, cardBody)
  _refreshEditor()
}
function _refreshEditor () {
  if (hasImage()) {
    renderPreviewImageWithRawData(getImageData(), 'image-spot')
  }
  _updateEditorData()
}
function _getCurrentCardBody () {
  const id = _getCurrentCardId()
  return window.lc.getData(`cardBody.${id}`)
}
function _updateEditorData () {
  const cardBody = _getCurrentCardBody()
  const showingAnswer = window.lc.getData('showingAnswer')
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
  const cards = window.lc.getData('orderedCards')
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
  getCardMapping,
  removeCard,
  handleEditorTextChange,
  getPresentFontSize
}
