const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: './client/js/entry-points/index.js',
    login: './client/js/entry-points/login.js'
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
      'component': path.join(__dirname, 'client/js/ui/components'),
      'abstract': path.join(__dirname, 'client/js/browserAbstractions')
    }
  }
}
