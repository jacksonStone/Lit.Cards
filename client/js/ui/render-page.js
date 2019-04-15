require('uswds')
const { render } = require('lit-html/lit-html')
const appHeader = require('component/app-header')

module.exports = (pageContentFunc, data = {}) => {
  render(appHeader(data.user), document.querySelector('#app-header'))
  render(pageContentFunc(data), document.querySelector('#main-content'))
}

console.log('Hello, Sailor!!')
