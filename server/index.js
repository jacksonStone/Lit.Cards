require('./validate-envs');
let path = require('path')
let loginUtils = require('./buisness-logic/authentication/login')
let dataConnector = require('./database/external-connections/configured-connector');
let { User } = require('./database')
let { addCookie } = require('./node-abstractions/cookie')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let ROOT = path.join(__dirname, '../')
let express = require('express')
let app = express()
let routes = require('./routes')
let ONE_YEAR = 1000 * 60 * 60 * 24 * 365

global.preventTransactions = false;
global.runningTransactions = 0;

app.use('/', routes.stripeWebhook);
app.use(cookieParser())
app.use(bodyParser.json({limit:'5mb', extended: true}))

//User middleware
app.use(async (req, res, next) => {
  let user = await loginUtils.getUserFromCookie(req.cookies)
  if (user) {
    req.userEmail = user.userEmail
    req.user = user
    if(req.user.planExpiration && req.user.planExpiration > Date.now()) {
      req.userSubbed = true;
    } else {
      //TODO::Maybe put all this somewhere else
      let freshUser = await User.getUser(user.userEmail);
      if (freshUser.planExpiration && freshUser.planExpiration > Date.now()) {
        let cookie = loginUtils.getLoginCookie(user)
        addCookie(res, cookie)
        req.userSubbed = true;
      } else {
        req.userSubbed = false;
      }
    }
  }
  next()
})

//Home page
app.get('/', function (req, res) {
  if (req.userEmail) {
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
app.use('/favicon.ico', express.static(path.join(ROOT, 'assets/favicon.ico'), { maxAge: ONE_YEAR }))


app.use(express.static(path.join(ROOT, '/assets/dist')))
let port = process.env.PORT || 3000;
(async () =>{
  await dataConnector.connectToDatabase();
  app.listen(port, () => console.info('App listening on port '+port+'!'))
})();
