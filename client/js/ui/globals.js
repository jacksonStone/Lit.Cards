require('uswds')
const { render } = require('lit-html/lit-html')
const { generateId } = require('../../../shared/id-generator')
const appHeader = require('component/app-header')
const defaultErrorObject = {
  fields: {},
  abstract: {}
}
const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}
const lc = window.lc = {
  test: false,
  testRoutes: [],
  generateNewId: generateId,
  _presentPage: () => {},
  data: {
    errors: clone(defaultErrorObject),
    changes: {}
  },
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
    if (!lc.data._willRerender && !NO_UPDATE) {
      lc.data._willRerender = true
      window.requestAnimationFrame(() => {
        lc.data._willRerender = false
        lc._rerender()
      })
    }
  },
  _rerender: () => {
    // mergeChangesIntoData()
    renderPage(lc._presentPage)
  },
  setPersistent (key, value) {
    lc.setData('changes.' + key, value)
    lc.setData('hasPersistentChanges', true)
    lc.setData(key, value)
  },
  setDeleted (obj, id) {
    const record = lc.data[obj][id]
    delete lc.data[obj][id]
    if (record.isNew) {
      return // nothing to persist, hasn't been saved
    }
    const currentDeletions = lc.getData(`deletions.${obj}`) || []
    currentDeletions.push(id)
    lc.setData(`deletions.${obj}`, currentDeletions)
    lc.setData('hasPersistentChanges', true)
  }
}

function renderPage (pageContentFunc) {
  render(appHeader(lc.getData('user')), document.querySelector('#app-header'))

  render(pageContentFunc(lc.data), document.querySelector('#main-content'))

  recordCurrentPage(pageContentFunc)
}

function recordCurrentPage (pageContentFunc) {
  lc._presentPage = pageContentFunc
}

exports.renderPage = renderPage

exports.makeTesting = () => {
  lc.test = true
}

exports.testing = {
  isTesting () {
    return lc.test
  },
  addTestRoute (route) {
    return lc.testRoutes.push(route)
  },
  getTestRoutes () {
    return lc.testRoutes
  },
  lastRoute () {
    const length = lc.testRoutes.length
    if (length) {
      return lc.testRoutes[ length - 1 ]
    }
  }
}
