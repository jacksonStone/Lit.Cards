const path = require('path')
const pagePath = path.resolve(__dirname, '../../../assets/html/')
function sendPage (res, page) {
  page = '/' + page + '.html'
  const options = {
    root: pagePath
  }
  return res.sendFile(page, options, function (err) {
    if (err) {
      console.error(err)
    }
  })
}

module.exports = {
  sendPage
}
