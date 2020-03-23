import { redirect } from '../../browser-abstractions/redirect';
interface map {[key: string]: string}
declare const URL_ROOT: string;
const electron = !!URL_ROOT;
function setUpRoute (route: string) {
  if(electron) {
    route = route + '.html';
  } else {
    route = '/site/' + route;
  }
  let routeFunction: any = function (params: map) {
    redirect(route + convertJSONToURLParams(params))
  }
  // is for testing
  routeFunction.getRouteAsString = function () {
    return route
  }
  return routeFunction
}

function convertJSONToURLParams (params: map): string {
  if (!params) return ''
  let keys = Object.keys(params)
  let paramString = '?'
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let value = params[key]
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

export { landingPage };
export const home = setUpRoute('me');
export const decks = setUpRoute('me/decks');
export const deck = setUpRoute('me/deck');
export const study = setUpRoute('me/study');
export const settings = setUpRoute('me/settings');
export const login = setUpRoute('login');
export const signup = setUpRoute('signup');

export default {
  landingPage,
  home,
  decks,
  deck,
  study,
  settings,
  login,
  signup,
}
