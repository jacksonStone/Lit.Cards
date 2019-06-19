const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './client/entry-points/index.js',
    login: './client/entry-points/login.js',
    me: './client/entry-points/me.js',
    deck: './client/entry-points/deck.js',
    signup: './client/entry-points/signup.js',
    study: './client/entry-points/study.js'
  },
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './assets/dist')
  },
  resolve: {
    alias: {
      'lit': path.join(__dirname, 'node_modules/lit-html/lit-html'),
      'misc': path.join(__dirname, 'misc'),
      'logic': path.join(__dirname, 'client/business-logic'),
      'api': path.join(__dirname, 'client/routes/api'),
      'site': path.join(__dirname, 'client/routes/navigation'),
      'utils': path.join(__dirname, 'client/utils'),
      'component': path.join(__dirname, 'client/ui/shared-components'),
      'abstract': path.join(__dirname, 'client/browser-abstractions'),
      'shared': path.join(__dirname, 'shared')
    }
  }
}
