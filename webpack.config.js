const path = require('path')
const fs = require('fs')
const entries = fs.readdirSync('./client/entry-points/').filter(function(file) {
  return file.match(/.*\.js$/);
});
entryForWebpack = {}
entries.forEach(entry => {
  const entryName = entry.split('.')[0]
  entryForWebpack[entryName] ='./client/entry-points/' + entry
})
module.exports = {
  mode: 'development',
  entry: entryForWebpack,
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
