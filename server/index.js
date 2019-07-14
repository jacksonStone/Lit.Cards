const path = require('path')
const loginUtils = require('./buisness-logic/authentication/login')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ROOT = path.join(__dirname, '../')
const express = require('express')
const app = express()
const routes = require('./routes')
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365
app.use(cookieParser())
app.use(bodyParser.json({limit:'5mb', extended: true}))

//User middleware
app.use(async (req, res, next) => {
  const user = await loginUtils.getUser(req.cookies)
  if (user) {
    req.userId = user.userId
    req.user = user
  }
  next()
})

//Home page
app.get('/', function (req, res) {
  if (req.userId) {
    return res.redirect('/site/me')
  }
  return routes.siteNavigation.returnIndexPage(req, res)
})

//API endpoints
app.use('/api', routes.api)
//App pages
app.use('/site', routes.siteNavigation.router)

//Third party assets
app.use('/uswds', express.static(path.join(ROOT, 'node_modules/uswds'), { maxAge: ONE_YEAR }))
app.use('/webfonts', express.static(path.join(ROOT, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: ONE_YEAR }))
app.use('/fonts', express.static(path.join(ROOT, 'assets/fonts'), { maxAge: ONE_YEAR }))

app.use(express.static(path.join(ROOT, '/assets/dist')))

app.listen(3000, () => console.info('Example app listening on port 3000!'))
