const { $ } = require('./$')
const pell = require('pell')
const editorConfig = {
  customConfig: '',
  toolbar: [
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline'] },
    { name: 'paragraph', groups: [ 'list' ], items: [ 'NumberedList', 'BulletedList'] }
  ],
  removePlugins: 'elementspath',
  uiColor: '#ffffff'
}

const MAX_FONT_SIZE = 5

function initEditor (elementId, startingContent, onChange) {
  const editor = pell.init({
    element: document.getElementById(elementId),
    actions: ['bold', 'italic', 'olist', 'ulist'],
    onChange: onChange
  })
  editor.content.innerHTML = startingContent
}

function getEditorData (elementId) {
  return CKEDITOR.instances[elementId].getData()
}

function unrenderEditor (elementId) {
  return CKEDITOR.instances[elementId].destroy()
}

function getWYSIWYGEditor (elementId) {
  const ckeditorElement = $('#' + elementId).nextSibling
  return $(ckeditorElement, '.cke_editable')
}

function getCKEditorContent (elementId) {
  const ckeditorElement = $('#' + elementId).nextSibling
  return $(ckeditorElement, '.cke_contents')
}

function getFontSize (elementId, currentFontSize) {
  if (currentFontSize >= MAX_FONT_SIZE) return MAX_FONT_SIZE

  const contentOverflows = doesContentOverflow(elementId)

  if (!contentOverflows) {
    return currentFontSize
  }

  scrollToTopOfContent(elementId)
  return currentFontSize + 1
}

function doesContentOverflow (elementId) {
  const WYSIWYG = getWYSIWYGEditor(elementId)
  const fullHeight = WYSIWYG.scrollHeight
  const clientHeight = WYSIWYG.clientHeight
  return fullHeight > clientHeight
}

function scrollToTopOfContent (elementId) {
  const ckeditorContents = getCKEditorContent(elementId)
  ckeditorContents.scrollTop = 0
}

exports.initEditor = initEditor
exports.getEditorData = getEditorData
exports.unrenderEditor = unrenderEditor
exports.getFontSize = getFontSize
