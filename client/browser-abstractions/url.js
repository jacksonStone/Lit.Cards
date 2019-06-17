const getPageParams = () => {
  const params = window.location.search
  if (!params || params.length < 2) return {}
  const withoutQuestionMark = params.substring(1)
  const paramPairs = withoutQuestionMark.split('&')
  const paramsObj = {}
  for (let i = 0; i < paramPairs.length; i++) {
    const paramPair = paramPairs[i]
    const paramPairParts = paramPair.split('=')
    paramsObj[paramPairParts[0]] = paramPairParts[1]
  }
  return paramsObj
}

const getParam = (param) => {
  return getPageParams()[param]
}

const getPage = () => {
  const current = window.location.href
  if (current.indexOf('/site/') === -1) {
    return 'home'
  }
  return current.substring(current.indexOf('/site/'))
}
const onPage = (pageName) => {
  return getPage().indexOf('/site/' + pageName) !== -1
}
module.exports = {
  getParam,
  onPage
}
