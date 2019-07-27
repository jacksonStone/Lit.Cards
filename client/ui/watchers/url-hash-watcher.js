const { hash } = require('abstract/url');
let lastSeenHash = hash()
function listenForHashChange () {

  setInterval(() => {
    const currentHash = hash()
    if(currentHash !== lastSeenHash) {
      //We just want a re-render to get queued up
      lastSeenHash = currentHash
      window.lc.setData()
    }
  }, 100)
}

module.exports = listenForHashChange
