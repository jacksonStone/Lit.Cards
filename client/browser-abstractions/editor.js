import { $ } from './$';
import pell from 'pell';
let elementId = 'editor'
let MAX_FONT_SIZE = 5
import createDOMPurify from 'dompurify';
import allowedTags from 'shared/allowedHTMLTags';
let santizationConfig = { ALLOWED_TAGS: allowedTags }

let sanitizer
function sanitizeHTML (text) {
  if (process.env.NODE_ENV !== 'test') {
    sanitizer = sanitizer || createDOMPurify(window)
    return sanitizer.sanitize(text, santizationConfig)
  }
  return text
}

function initEditor (startingContent, onChange) {
  let editorElement = document.getElementById(elementId)
  let editor = pell.init({
    element: document.getElementById(elementId),
    actions: ['bold', 'italic', 'olist', 'ulist'],
    onChange: onChange
  })
  editor.content.innerHTML = startingContent || ''
  // IE - This is not supported for IE
  editorElement.addEventListener('paste', function (e) {
    // cancel paste
    e.preventDefault()

    // get text representation of clipboard
    var formattedHTML = (e.originalEvent || e).clipboardData.getData('text/html')
    let documentFragment = document.createRange().createContextualFragment(formattedHTML)
    let chidlens = documentFragment.querySelectorAll('[style]')
    if (chidlens && chidlens.length) {
      chidlens.forEach(chidlen => {
        chidlen.removeAttribute('style')
      })
    }
    var div = document.createElement('div')
    div.appendChild(documentFragment.cloneNode(true))
    let htmlContent = sanitizeHTML(div.innerHTML)
    // insert text manually
    document.execCommand('insertHTML', false, htmlContent)
  })
}

function setEditorData (content) {
  let editor = document.getElementById(elementId)
  // If we are on the study page for example
  if (!editor || !editor.content) return
  editor.content.innerHTML = content
}

function getFontSize (currentFontSize) {
  if (currentFontSize >= MAX_FONT_SIZE) return MAX_FONT_SIZE

  let contentOverflows = doesContentOverflow()

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
  let editorContent = getEditorContent()
  editorContent.scrollTop = 0
}
function getTextNodeHeight (textNode) {
  let height = 0
  if (window.document.createRange) {
    let range = window.document.createRange()
    range.selectNodeContents(textNode)
    if (range.getBoundingClientRect) {
      var rect = range.getBoundingClientRect()
      if (rect) {
        height = rect.bottom - rect.top
      }
    }
  }
  return height
}
let emptySpaceBeforeIncrease = 0.65
function childrenHaveTooMuchSpace () {
  let WYSIWYG = getEditorContent()
  let children = WYSIWYG.childNodes
  let fullHeight = WYSIWYG.scrollHeight
  let clientHeight = WYSIWYG.clientHeight
  if (fullHeight > clientHeight) {
    // We overflow
    return false
  }

  let height = 0
  if (children && children.length) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i]
      if (child.clientHeight) {
        height += child.clientHeight
      } else if (child.nodeName === '#text') {
        height += getTextNodeHeight(child)
      }
    }
  }
  if (height < clientHeight * (1 - emptySpaceBeforeIncrease)) {
    return true
  }
  return false
}

function doesContentOverflow () {
  let WYSIWYG = getEditorContent()
  let fullHeight = WYSIWYG.scrollHeight
  let clientHeight = WYSIWYG.clientHeight
  return fullHeight > clientHeight
}

function getTextOnly (content) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = content
  return wrapper.innerText
}

export { initEditor, setEditorData, getFontSize, getTextOnly, childrenHaveTooMuchSpace };
