const { $ } = require('./$')
const pell = require('pell')
const elementId = 'editor'
const MAX_FONT_SIZE = 5

function initEditor (startingContent, onChange) {
  const editor = pell.init({
    element: document.getElementById(elementId),
    actions: ['bold', 'italic', 'olist', 'ulist'],
    onChange: onChange
  })
  editor.content.innerHTML = startingContent
}

function setEditorData (content) {
  const editor = document.getElementById(elementId)
  // If we are on the study page for example
  if (!editor || !editor.content) return
  editor.content.innerHTML = content
}

function getFontSize (currentFontSize) {
  if (currentFontSize >= MAX_FONT_SIZE) return MAX_FONT_SIZE

  const contentOverflows = doesContentOverflow()

  if (!contentOverflows) {
    return currentFontSize
  }

  scrollToTopOfEditor(elementId)
  return currentFontSize + 1
}

function getEditorContent () {
  return $('.pell-content')
}
function scrollToTopOfEditor () {
  const editorContent = getEditorContent()
  editorContent.scrollTop = 0
}

function doesContentOverflow () {
  const WYSIWYG = getEditorContent()
  const fullHeight = WYSIWYG.scrollHeight
  const clientHeight = WYSIWYG.clientHeight
  return fullHeight > clientHeight
}

function getTextOnly (content) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = content
  return wrapper.innerText
}

exports.initEditor = initEditor
exports.setEditorData = setEditorData
exports.getFontSize = getFontSize
exports.getTextOnly = getTextOnly
