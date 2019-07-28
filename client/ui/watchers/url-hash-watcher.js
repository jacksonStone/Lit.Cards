const { hash } = require('abstract/url');
let lastSeenHash = hash()
function listenForHashChange () {
  window.onhashchange = () => {
    const currentHash = hash()
    if(currentHash !== lastSeenHash) {
      //We just want a re-render to get queued up
      lastSeenHash = currentHash
      window.lc.setData()
    }
  }
}

module.exports = listenForHashChange
