const {renderPage} = require('../ui/globals')
const content = require('../ui/page-content/index')
const { initEditor } = require('abstract/editor')
renderPage(content)
initEditor('editor', '<span>Hey there</span>', () => {
  console.log('changed')
})
