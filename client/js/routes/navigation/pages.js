const { redirect } = require('abstract/redirect')
function setUpRoute (route) {
  route = '/site/' + route
  const routeFunction = function (params) {
    redirect(route + convertJSONToURLParams(params))
  }
  // is for testing
  routeFunction.getRouteAsString = function () {
    return route
  }
  return routeFunction
}

function convertJSONToURLParams (params) {
  if (!params) return ''
  const keys = Object.keys(params)
  let paramString = '?'
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = params[key]
    paramString += key + '=' + value
    if (i !== keys.length - 1) {
      paramString += '&'
    }
  }
  return paramString
}

function landingPage () {
  redirect('/')
}
landingPage.getRouteAsString = function () {
  return '/'
}

// Pages
exports.landingPage = landingPage
exports.home = setUpRoute('home')
exports.decks = setUpRoute('me/decks')
exports.login = setUpRoute('login')
