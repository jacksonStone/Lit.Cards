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
    let currentPiece = lc.data
    const parts = key.split('.')
    for (let part of parts) {
      if (!currentPiece) return currentPiece
      currentPiece = currentPiece[part]
    }
    const value = currentPiece
    if ((typeof value === 'object') && (value !== null)) {
      return value
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
    lc.setData('changes.' + key, value, true)
    lc.setData('hasPersistentChanges', true, true)
    lc.setData(key, value)
  }
}

// function mergeChangesIntoData () {
//   const data = lc.data
//   const changes = lc.data.changes
//   const objsInData = Object.keys(data)
//   for (let i = 0; i < objsInData.length; i++) {
//     const key = objsInData[i]
//     if (!changes[key]) continue
//     const changeForObj = changes[key]
//     const changesNotYetMerged = clone(changeForObj)
//     // Merge changes to existing records
//     for (let j = 0; j < data[key].length; j++) {
//       const id = data[key][j].id
//       if (changeForObj[id]) {
//         data[key][j] = Object.assign({}, data[key][j], changesNotYetMerged[id])
//         delete changesNotYetMerged[id]
//       }
//     }
//     // Merge in new records
//     for (let change in changesNotYetMerged) {
//       data[key].push(changesNotYetMerged[change])
//     }
//   }
//
// }
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
