require('./validate-envs');
// This must be required before any routes are defined in ExpressJS for error handling to operate correctly
require('./async-error-handling');

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
app.enable('etag')
app.use('/', routes.stripeWebhook);
app.use(cookieParser())
let PROD = process.env.NODE_ENV === 'production';
//User middleware
app.use(async (req, res, next) => {
  let user = loginUtils.getUserFromCookie(req.cookies)
  if (user) {
    req.userEmail = user.userEmail
    req.user = user
    if (req.user.planExpiration && req.user.planExpiration > Date.now()) {
      req.userSubbed = true;
    }
    //We want to check these off the live database each time rather than fetch from
    //use the cookie as these may have changed
    if (!req.user.verifiedEmail || !req.userSubbed) {
      let freshUser;
      try {
        freshUser = await User.getUser(user.userEmail);
      } catch (error) {
        console.error(error)
        return res.redirect('/site/logout')
      }
      if (!freshUser) {
        return res.redirect('/site/logout')
      }
      let cookie = loginUtils.getLoginCookie(freshUser)
      addCookie(res, cookie)

      if (freshUser.planExpiration && freshUser.planExpiration > Date.now()) {
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
app.use('/site', routes.siteNavigation.router)

//Third party assets
app.use('/uswds', (req, res, next) => {
  if (PROD && req.url.indexOf('uswds.min.css') > -1) {
    res.setHeader("Content-Encoding", "gzip");
    // res.setHeader("Content-Type", )
  }
  next();
}, express.static(path.join(ROOT, 'node_modules/uswds'), { maxAge: ONE_YEAR }))
app.use('/webfonts', express.static(path.join(ROOT, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: ONE_YEAR }))
app.use('/fonts', express.static(path.join(ROOT, 'assets/fonts'), { maxAge: ONE_YEAR }))
app.use('/favicon.ico', express.static(path.join(ROOT, 'assets/static-images/favicon.ico'), { maxAge: ONE_YEAR }))
app.use('/static-images', express.static(path.join(ROOT, 'assets/static-images'), { maxAge: ONE_YEAR }))


//We need to use this before setting up bodyParser.json
app.use('/api/transaction', require('./routes/api/middleware').requireActiveSub);
app.use('/api/transaction', bodyParser.raw({ type: 'application/octet-stream', limit: '1mb' }))
app.use('/api/transaction', require('./routes/api/transaction'))

//API endpoints
app.use('/api', routes.api)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    }
  });
});
//App pages
app.use((req, res, next) => {
  if (PROD) {
    if (req.url.indexOf('.js') > -1 || req.url.indexOf('.css') > -1) {
      res.setHeader("Content-Encoding", "gzip");
      if (req.url.indexOf('.js') > -1) {
        // Set MIME Type
        res.setHeader("Content-Type", "text/javascript")
      } else {
        res.setHeader("Content-Type", "text/css")
      }
    }
  }
  next();
}, express.static(path.join(ROOT, '/assets/dist')))

let port = process.env.PORT || 3001;
(async () => {
  await dataConnector.connectToDatabase();
  app.listen(port, () => console.info('App listening on port ' + port + '!'))
})();
