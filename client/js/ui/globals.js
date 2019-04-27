require('uswds')
const { render } = require('lit-html/lit-html')
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
  _presentPage: () => {},
  data: {
    errors: clone(defaultErrorObject),
    changes: {}
  },
  getData: (key) => {
    const parts = key.split('.')
    let currentPiece = lc.data
    for (let part of parts) {
      if (!currentPiece) return currentPiece
      currentPiece = currentPiece[part]
    }
    const value = currentPiece
    if ((typeof value === 'object') && (value !== null)) {
      return JSON.parse(JSON.stringify(value))
    }
    return value
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
    console.log('rerender')
    renderPage(lc._presentPage)
  },
  setPersistent (key, value) {
    console.log('calling setPersistent', key, value)
    // TODO:: Maybe add some stuff so that this saves locally right away and saves to server async
    lc.setData('changes.' + key, value, true)
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
