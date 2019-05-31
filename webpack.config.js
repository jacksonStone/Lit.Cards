const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './client/js/entry-points/index.js',
    login: './client/js/entry-points/login.js',
    me: './client/js/entry-points/me.js',
    deck: './client/js/entry-points/deck.js',
    signup: './client/js/entry-points/signup.js',
    study: './client/js/entry-points/study.js'
  },
  watch: true,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './client/dist')
  },
  resolve: {
    alias: {
      'logic': path.join(__dirname, 'client/js/buisnessLogic'),
      'api': path.join(__dirname, 'client/js/routes/api'),
      'site': path.join(__dirname, 'client/js/routes/navigation'),
      'utils': path.join(__dirname, 'client/js/utils'),
      'component': path.join(__dirname, 'client/js/ui/shared-components'),
      'abstract': path.join(__dirname, 'client/js/browserAbstractions'),
      'shared': path.join(__dirname, 'shared')
    }
  }
}
