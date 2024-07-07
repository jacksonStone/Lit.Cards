import 'uswds'
import { render, TemplateResult } from 'lit-html/lit-html'
import { generateId } from 'shared/id-generator'
import persistentDataChanges from './watchers/persistent-data-changes'
import userInput from './watchers/user-input'
import urlHashWatcher from './watchers/url-hash-watcher'
import windowResizeWatcher from './watchers/window-resize'
import appHeader from './shared-components/app-header'
import { initDebug, deactivateDebug } from './debug-global'
import { each } from 'utils'
let defaultErrorObject = {
  fields: {},
  abstract: {}
}
let clone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}
let emptyDataState = {
  errors: defaultErrorObject,
  changes: {},
  screen: { width: window.innerWidth }
}
function resetData () {
  lc.data = {
    errors: defaultErrorObject,
    changes: {},
    screen: { width: window.innerWidth }
  }
}
function getParts (periodStr: string) {
  const parts = []
  let i = 0
  let piece = ''
  while (i < periodStr.length) {
    if (periodStr[i] === '.' && !piece) {
      // Period leading keys are permitted
      piece += '.'
    } else if (periodStr[i] !== '.') {
      piece += periodStr[i]
    } else {
      parts.push(piece)
      piece = ''
    }
    i++
  }
  if (piece) {
    parts.push(piece)
  }
  return parts
}
function initLC () {
  let testRoutes: Array<any> = [];
  let _presentPage: (content: any) => TemplateResult;
  return {
    test: false,
    testRoutes,
    generateNewId: generateId,
    _presentPage: _presentPage,
    data: clone(emptyDataState),
    getData: (key:string) => {
      let currentPiece = lc.data
      let parts = getParts(key)
      for (let part of parts) {
        if (!currentPiece) return currentPiece
        currentPiece = currentPiece[part]
      }
      // Do not clone this
      return currentPiece
    },
    setSaving: (saving: boolean) => {
      lc.data.saving = saving
    },
    setFileUploading: (uploading: boolean) => {
      lc.data.fileUploading = uploading
    },
    hasPersistentChanges: () => {
      return !!Object.keys(lc.data.changes).length
    },
    getPersistentChanges: () => {
      return lc.data.changes
    },
    flushPersistentChanges: () => {
      each(lc.data.changes, (_, key) => {
        delete lc.data.changes[key]
      })
    },
    _willRerender: false,
    recordError: (path: string, error: any) => {
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
    setData: (key: string, value: any, NO_UPDATE?:boolean) => {
      if (key) {
        let paths = getParts(key)
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
        // if (false) {
        //   lc.recordedSetData = lc.recordedSetData || []
        //   try {
        //     throw new Error('Fake error')
        //   } catch (e) {
        //     let stack = e.stack
        //     let recordedStack = stack.split('Error: Fake error').join('').split('\n    at ')
        //     recordedStack = recordedStack.slice(2)
        //     recordedStack.forEach((entry, index) => {
        //       let webpackFluff = 'webpack:///'
        //       recordedStack[index] = entry.split(webpackFluff).join('')
        //     })
        //     lc.recordedSetData.push({ key, value, NO_UPDATE, stack: recordedStack })
        //   }
        // }
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
    setPersistent (key:string, value:any) {
      lc.setData('changes.' + key, value)
      lc.setData(key, value)
    },
    setPersistentOnly (key:string, value:any) {
      lc.setData('changes.' + key, value)
    },
    setDeleted (obj:string, id:string) {
      delete lc.data[obj][id]
      lc.setData(`changes.${obj}.${id}.deleted`, true)
    },
    _debugging: false,
    debugging () {
      return false
      // return lc._debugging
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
  windowResizeWatcher()
}
function renderPage (pageContentFunc: (content: any) => TemplateResult) {
  if(!pageContentFunc) {
    return;
  }
  recordCurrentPage(pageContentFunc)
  render(appHeader(lc.getData('user')), window.document.querySelector('#app-header'))
  render(pageContentFunc(lc.data), window.document.querySelector('#main-content'))
}

function recordCurrentPage (pageContentFunc: (content: any) => TemplateResult) {
  lc._presentPage = pageContentFunc
}

export const makeTesting = () => {
  lc.test = true
}

export { renderPage, initLC, resetData }
