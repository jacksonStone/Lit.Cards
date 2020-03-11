let path = require('path')
let fs = require('fs')
let webpack = require('webpack')

let entries = fs.readdirSync('./client/entry-points/');
let prodMode = process.env.NODE_ENV === 'production'
entryForWebpack = {}
entries.forEach(entry => {
  let entryName = entry.split('.')[0]
  entryForWebpack[entryName] ='./client/entry-points/' + entry
})
const plugins = [
  new webpack.DefinePlugin({
    'STRIPE_PUBLIC_KEY' : JSON.stringify(process.env.STRIPE_PUBLIC_KEY)
  })
];

module.exports = {
  mode: prodMode ? 'production' : 'development',
  entry: entryForWebpack,
  // watch: !prodMode,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './assets/dist')
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      'lit': path.join(__dirname, 'node_modules/lit-html/lit-html'),
      'misc': path.join(__dirname, 'misc'),
      'logic': path.join(__dirname, 'client/business-logic'),
      'types': path.join(__dirname, 'client/types/types'),
      'api': path.join(__dirname, 'client/routes/api'),
      'site': path.join(__dirname, 'client/routes/navigation'),
      'utils': path.join(__dirname, 'client/utils'),
      'component': path.join(__dirname, 'client/ui/shared-components'),
      'abstract': path.join(__dirname, 'client/browser-abstractions'),
      'shared': path.join(__dirname, 'client/shared-client')
    }
  },
  plugins
}
