const render = require('../ui/render-page')
const content = require('../ui/page-content/index')
const { initEditor } = require('abstract/editor')
render(content)
initEditor('editor', '<span>Hey there</span>', () => {
  console.log('changed')
})
