require('uswds')
const { render } = require('lit-html/lit-html')
const { generateId } = require('../../shared/id-generator')
const listenForChanges = require('logic/handle-save')
const appHeader = require('./shared-components/app-header')
const { initDebug, deactivateDebug } = require('./debug-global')
const defaultErrorObject = {
  fields: {},
  abstract: {}
}
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
const emptyDataState = {
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
      const parts = key.split('.')
      for (let part of parts) {
        if (!currentPiece) return currentPiece
        currentPiece = currentPiece[part]
      }
      // Do not clone this
      return currentPiece
    },
    hasPersistentChanges: () => {
      return !!Object.keys(lc.data.changes).length
    },
    getPersistentChanges: () => {
      return lc.data.changes
    },
    _willRerender: false,
    recordError: (path, error) => {
      lc.setData('errors.' + path, error)
    },
    resetErrors: () => {
      lc.setData('errors', clone(defaultErrorObject), true)
    },
    addDataListEntry (obj, data) {
      const objs = lc.data[obj]
      if (!objs) {
        lc.data[obj] = [data]
      } else {
        objs.push(data)
      }
    },
    /**
     * @param key:  can be in  form "foo.bar"
     * @param value: Current value to set the data
     * @param NO_UPDATE: Prevents setData from trying to re-render
     */
    setData: (key, value, NO_UPDATE) => {
      const paths = key.split('.')
      let parent = lc.data
      for (let i = 0; i < paths.length; i++) {
        const currentPath = paths[i]
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
          const stack = e.stack
          recordedStack = stack.split('Error: Fake error').join('').split('\n    at ')
          recordedStack = recordedStack.slice(2)
          recordedStack.forEach((entry, index) => {
            const webpackFluff = 'webpack:///'
            recordedStack[index] = entry.split(webpackFluff).join('')
          })
          lc.recordedSetData.push({key, value, NO_UPDATE, stack: recordedStack})
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
const lc = window.lc = initLC()
if (lc._debugging === undefined && process.env.NODE_ENV === 'development') {
  lc.debugMode(false)
}
if (process.env.NODE_ENV !== 'test') {
  listenForChanges()
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
