const path = require('path')

module.exports = {
  entry: './client/js/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'index.js'
  }
}
