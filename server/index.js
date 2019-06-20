const path = require('path')
const loginUtils = require('./buisness-logic/authentication/login')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ROOT = path.join(__dirname, '../')
const express = require('express')
const app = express()
const routes = require('./routes')

app.use(cookieParser())
app.use(bodyParser.json({limit:'5mb', extended: true}))
app.use(async (req, res, next) => {
  const userId = await loginUtils.getuserId(req.cookies)
  req.userId = userId
  next()
})
app.get('/', function (req, res) {
  if (req.userId) {
    return res.redirect('/site/me')
  }
  res.sendFile(path.join(ROOT, '/assets/html/index.html'))
})
app.use('/api', routes.api)
app.use('/site', routes.siteNavigation)
app.use('/uswds', express.static(path.join(ROOT, 'node_modules/uswds'), { maxAge: 1000 * 60 * 60 * 24 }))
app.use('/webfonts', express.static(path.join(ROOT, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 1000 * 60 * 60 * 24 * 360 }))
app.use('/fonts', express.static(path.join(ROOT, 'assets/fonts'), { maxAge: 1000 * 60 * 60 * 24 * 360 }))
app.use(express.static(path.join(ROOT, '/assets/dist')))

app.listen(3000, () => console.info('Example app listening on port 3000!'))
