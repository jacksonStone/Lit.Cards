const path = require('path')
const pagePath = path.resolve(__dirname, '../../../assets/html/template.html')
const defaultPage = require('fs').readFileSync(pagePath, 'utf8')
const TOKEN_MARKER = '__'
const pageSplit = defaultPage.split(TOKEN_MARKER)
function sendPage (res, details, user) {
  const darkMode = details.darkModeable && user && user.darkMode;
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
