let getPageParams = () :{[key: string]: string} => {
  let params = window.location.search
  if (!params || params.length < 2) return {}
  let withoutQuestionMark = params.substring(1)
  let paramPairs = withoutQuestionMark.split('&')
  let paramsObj: {[key: string]: string} = {}
  for (let i = 0; i < paramPairs.length; i++) {
    let paramPair = paramPairs[i]
    let paramPairParts = paramPair.split('=')
    paramsObj[paramPairParts[0]] = paramPairParts[1]
  }
  return paramsObj
}

let getParam = (param: string) => {
  return getPageParams()[param]
}

let getPage = (): string => {
  let current = window.location.href
  if (current.indexOf('/site/') === -1) {
    return 'home'
  }
  return current.substring(current.indexOf('/site/'))
}
let onPage = (pageName: string): boolean => {
  return getPage().indexOf('/site/' + pageName) !== -1
}
let onExactPage = (pageName: string): boolean => {
  let pageURL = getPage()
  if (pageURL.indexOf('?') !== -1) {
    pageURL = pageURL.substring(0, pageURL.indexOf('?'))
  } else
  if (pageURL.indexOf('#') !== -1) {
    pageURL = pageURL.substring(0, pageURL.indexOf('#'))
  }
  pageURL = pageURL.substring('/site/'.length)
  return pageURL === pageName
}

let hash = (): string => {
  let hash = window.location.hash
  if (!hash) return ''
  return hash.substring(1).split('?')[0]
}

export {
  hash,
  getParam,
  onPage,
  onExactPage
}
