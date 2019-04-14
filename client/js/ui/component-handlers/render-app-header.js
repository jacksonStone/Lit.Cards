const { render } = require('lit-html/lit-html')
const appHeader = require('../components/app-header')

render(appHeader(), document.querySelector('#app-header'))
