require('uswds')
require('./component-handlers/render-app-header')
const { render } = require('lit-html/lit-html')

module.exports = (pageContentFunc) => {
  render(pageContentFunc(), document.querySelector('#main-content'))
}

console.log('Hello, Sailor!!')
