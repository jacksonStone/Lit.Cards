require('uswds')
let { render } = require('lit-html/lit-html')
let { generateId } = require('../../shared/id-generator')
let persistentDataChanges = require('./watchers/persistent-data-changes')
let userInput = require('./watchers/user-input')
let urlHashWatcher = require('./watchers/url-hash-watcher')
let appHeader = require('./shared-components/app-header')
let { initDebug, deactivateDebug } = require('./debug-global')
let { each } = require('utils')
let defaultErrorObject = {
  fields: {},
  abstract: {}
}
let clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
let emptyDataState = {
  errors: defaultErrorObject,
  changes: {}
}
function resetData () {
  lc.data = clone(emptyDataState)
}
function initLC () {
  return {
    test: false,
    testRoutes: [],
    generateNewId: generateId,
    _presentPage: () => {},
    data: clone(emptyDataState),
    getData: (key) => {
      let currentPiece = lc.data
      let parts = key.split('.')
      for (let part of parts) {
        if (!currentPiece) return currentPiece
        currentPiece = currentPiece[part]
      }
      // Do not clone this
      return currentPiece
    },
    setSaving: (saving) => {
      lc.data.saving = saving;
    },
    setFileUploading: (uploading) => {
      lc.data.fileUploading = uploading;
    },
    hasPersistentChanges: () => {
      return !!Object.keys(lc.data.changes).length
    },
    getPersistentChanges: () => {
      return lc.data.changes
    },
    flushPersistentChanges: () => {
      each(lc.data.changes, (_, key) => {
        delete lc.data.changes[key];
      })
    },
    _willRerender: false,
    recordError: (path, error) => {
      lc.setData('errors.' + path, error)
    },
    resetErrors: () => {
      lc.setData('errors', clone(defaultErrorObject), true)
    },
    /**
     * @param key:  can be in  form "foo.bar"
     * @param value: Current value to set the data
     * @param NO_UPDATE: Prevents setData from trying to re-render
     */
    setData: (key, value, NO_UPDATE) => {
      if (key) {
        let paths = key.split('.')
        let parent = lc.data
        for (let i = 0; i < paths.length; i++) {
          let currentPath = paths[i]
          if (i === paths.length - 1) {
            parent[currentPath] = value
            break
          } else {
            parent = parent[currentPath] = (parent[currentPath] || {})
          }
        }
        if (lc._debugging) {
          lc.recordedSetData = lc.recordedSetData || []
          try {
            throw new Error('Fake error')
          } catch (e) {
            let stack = e.stack
            let recordedStack = stack.split('Error: Fake error').join('').split('\n    at ')
            recordedStack = recordedStack.slice(2)
            recordedStack.forEach((entry, index) => {
              let webpackFluff = 'webpack:///'
              recordedStack[index] = entry.split(webpackFluff).join('')
            })
            lc.recordedSetData.push({ key, value, NO_UPDATE, stack: recordedStack })
          }
        }
      }
      if (!lc.data._willRerender && !NO_UPDATE) {
        lc.data._willRerender = true
        window.requestAnimationFrame(() => {
          lc.data._willRerender = false
          lc._rerender()
        })
      }
    },
    _rerender: () => {
      renderPage(lc._presentPage)
    },
    setPersistent (key, value) {
      lc.setData('changes.' + key, value)
      lc.setData(key, value)
    },
    setPersistentOnly (key, value) {
      lc.setData('changes.' + key, value)
    },
    setDeleted (obj, id) {
      delete lc.data[obj][id]
      lc.setData(`changes.${obj}.${id}.deleted`, true)
    },
    debugging () {
      return lc._debugging
    },
    debugMode (rerender = true) {
      initDebug(rerender)
    },
    prodMode () {
      deactivateDebug()
    }
  }
}
let lc = window.lc = initLC()
if (lc._debugging === undefined && process.env.NODE_ENV === 'development') {
  lc.debugMode(false)
}

// Setup app listeners AFTER window.lc is initialized
if (process.env.NODE_ENV !== 'test') {
  persistentDataChanges()
  userInput()
  urlHashWatcher()
}

function renderPage (pageContentFunc) {
  render(appHeader(lc.getData('user')), window.document.querySelector('#app-header'))

  render(pageContentFunc(lc.data), window.document.querySelector('#main-content'))

  recordCurrentPage(pageContentFunc)
}

function recordCurrentPage (pageContentFunc) {
  lc._presentPage = pageContentFunc
}

exports.renderPage = renderPage

exports.makeTesting = () => {
  lc.test = true
}

exports.initLC = initLC
exports.resetData = resetData
