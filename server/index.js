const path = require('path')
const loginUtils = require('./buisnessLogic/authentication/login')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ROOT = path.join(__dirname, '../')
const express = require('express')
const app = express()
const routes = require('./routes')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(async (req, res, next) => {
  const username = await loginUtils.getUsername(req.cookies)
  req.username = username
  next()
})
app.get('/', function (req, res) {
  res.sendFile(path.join(ROOT, '/client/html/index.html'))
})
app.use('/api', routes.api)
app.use('/site', routes.siteNavigation)
app.use('/uswds', express.static(path.join(ROOT, 'node_modules/uswds')))
app.use('/fonts', express.static(path.join(ROOT, 'client/fonts')))
app.use(express.static(path.join(ROOT, '/client/dist')))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
