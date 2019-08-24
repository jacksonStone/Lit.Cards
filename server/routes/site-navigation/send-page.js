let path = require('path')
let pagePath = path.resolve(__dirname, '../../../assets/html/template.html')
let defaultPage = require('fs').readFileSync(pagePath, 'utf8')
let TOKEN_MARKER = '__'
let pageSplit = defaultPage.split(TOKEN_MARKER)
function sendPage (res, details, user) {
  let darkMode = details.darkModeable && user && user.darkMode;
  details.darkMode = darkMode ? 'class="darkmode"' : ''
  let renderedPage = ''
  for(let i = 0; i < pageSplit.length; i++) {
    if (i%2 === 1) {
      //Is token
      renderedPage += details[pageSplit[i]]
    } else {
      renderedPage += pageSplit[i]
    }
  }
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(renderedPage));
}

module.exports = {
  sendPage
}
