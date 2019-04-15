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
const sn = window.sn = {
  test: false,
  testRoutes: [],
  _clickHandler: {},
  clickHandler: (name) => {
    return sn._clickHandler[name]
  },
  _presentPage: () => {},
  data: {
    errors: clone(defaultErrorObject)
  },
  getData: (key) => {
    const value = sn.data[key]
    if ((typeof value === 'object') && (value !== null)) {
      return Object.assign({}, value)
    }
    return value
  },
  _willRerender: false,
  recordError: (path, error) => {
    sn.setData('errors.' + path, error)
  },
  resetErrors: () => {
    sn.setData('errors', clone(defaultErrorObject), true)
  },
  /**
   * @param key:  can be in  form "foo.bar"
   * @param value: Current value to set the data
   * @param NO_UPDATE: Prevents setData from trying to re-render
   */
  setData: (key, value, NO_UPDATE) => {
    const paths = key.split('.')
    let parent = sn.data
    for (let i = 0; i < paths.length; i++) {
      const currentPath = paths[i]
      if (i === paths.length - 1) {
        parent[currentPath] = value
        break
      } else {
        parent = parent[currentPath] = (parent[currentPath] || {})
      }
    }
    if (!sn.data._willRerender && !NO_UPDATE) {
      sn.data._willRerender = true
      window.requestAnimationFrame(() => {
        sn.data._willRerender = false
        sn._rerender()
      })
    }
  },
  _rerender: () => {
    console.log('rerender')
    renderPage(sn._presentPage)
  }
}

function renderPage (pageContentFunc) {
  render(appHeader(sn.getData('user')), document.querySelector('#app-header'))
  render(pageContentFunc(sn.data), document.querySelector('#main-content'))
  recordCurrentPage(pageContentFunc)
}

function recordCurrentPage (pageContentFunc) {
  sn._presentPage = pageContentFunc
}

exports.renderPage = renderPage

exports.makeTesting = () => {
  sn.test = true
}

exports.testing = {
  isTesting () {
    return sn.test
  },
  addTestRoute (route) {
    return sn.testRoutes.push(route)
  },
  getTestRoutes () {
    return sn.testRoutes
  },
  lastRoute () {
    const length = sn.testRoutes.length
    if (length) {
      return sn.testRoutes[ length - 1 ]
    }
  }
}
