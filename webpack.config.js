let path = require('path')
let fs = require('fs')
let webpack = require('webpack')
// const CompressionPlugin = require('compression-webpack-plugin');

let entries = fs.readdirSync('./client/entry-points/')
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
// if(prodMode) {
//   plugins.push(new CompressionPlugin({
//     filename:'[file]'
//   }));
// }
module.exports = {
  mode: prodMode ? 'production' : 'development',
  entry: entryForWebpack,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  // watch: !prodMode,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './assets/dist')
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
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
  },
  plugins
}
