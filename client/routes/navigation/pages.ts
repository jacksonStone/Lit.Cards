import { redirect } from '../../browser-abstractions/redirect';
interface map {[key: string]: string}
declare const electron: any;
function setUpRoute (route: string) {
  if(electron) {
    route = route + '.html';
  } else {
    route = '/site/' + route;
  }
  let routeFunction: any = function (params?: map, hash:string = '') {
    redirect(route + convertJSONToURLParams(params) + hash)
  }
  // is for testing
  routeFunction.getRouteAsString = function () {
    return route
  }
  return routeFunction
}

function convertJSONToURLParams (params?: map): string {
  if (!params) return ''
  let keys = Object.keys(params)
  let paramString = ''
  if(keys.length) {
    paramString = '?'
  }
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
export const deck = setUpRoute('deck');
export const study = setUpRoute('study');
export const settings = setUpRoute('settings');
export const login = setUpRoute('login');
export const signup = setUpRoute('signup');

export default {
  landingPage,
  home,
  deck,
  study,
  settings,
  login,
  signup,
}
