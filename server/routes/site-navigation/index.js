var express = require('express')
var router = express.Router()
let _ = require('lodash');
let { sendPage } = require('./send-page');

let makePageRoute = (path, details, auth) => {
  router.get(path, async (req, res) => {
    if(auth) {
      if (!req.userEmail) return res.redirect('/')
    }
    if(details.subOnly) {
      if(!req.userSubbed) {
        return res.redirect('/site/me/settings#plan-details');
      }
    }
    return sendPage(res, details, req.user)
  })
}

let pages = {
  '/': {
    darkModeable: false,
    title: 'Lit.Cards',
    description: "Fast and simple online notecards",
    entryFile: 'index.js',
    auth: false
  },
  '/forgot-password': {
    title: 'Lit: Forgotten password',
    darkModeable: false,
    description: "Forgot page",
    page: 'forgot-password',
    entryFile: 'forgot-password.js',
    auth: false
  },
  '/verify': {
    darkModeable: false,
    title: 'Lit: New password',
    description: "New password",
    page: 'verify-password-reset',
    entryFile: 'verify-password-reset.js',
    auth: false
  },
  '/login': {
    title: 'Lit: Login',
    darkModeable: false,
    description: "Login page",
    entryFile: 'login.js',
    page: 'login',
    auth: false
  },
  '/signup': {
    title: 'Lit: Sign Up',
    description: "Signup page",
    darkModeable: false,
    page: 'signup',
    entryFile: 'signup.js',
    auth: false
  },
  // url to visit: /site/me for example
  '/me': {
    title: 'Lit: Your stuff',
    description: "All decks and study sessions",
    darkModeable: true,
    entryFile: 'me.js',
    // auth: true - default
  },
  '/me/deck': {
    title: 'Lit: Edit deck',
    darkModeable: true,
    description: "Edit deck",
    entryFile: 'deck.js',
    page: 'me/deck',
    subOnly: true
  },
  '/me/settings': {
    title: 'Lit: Settings',
    description: "User settings",
    entryFile: 'settings.js',
    additionalFiles: `<script src=https://js.stripe.com/v3/></script>`,
    darkModeable: true,
  },
  '/me/study': {
    title: 'Lit: Study',
    entryFile: 'study.js',
    description: "Study session",
    darkModeable: true,
    subOnly: true
  },
}

_.each(pages, (details, path) => {
  // Auth: true - default
  let auth = details.auth === undefined ? true : details.auth
  makePageRoute(path, details, auth)
})

function returnIndexPage (req, res) {
  return sendPage(res, pages['/'], req.user)
}

module.exports = {
  router,
  returnIndexPage
}
