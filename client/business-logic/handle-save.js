function listenToSaveableChanges () {
  let runningAlready = false
  setInterval(() => {
    if (runningAlready || !window.lc.hasPersistentChanges()) {
      return
    }
    runningAlready = true
    // TODO:: Maybe do something more intelligent here
    _handleChanges().then(() => {
      runningAlready = false
    }).catch(() => {
      runningAlready = false
    })
  }, 1000)
}

async function _handleChanges () {
  const changes = window.lc.getPersistentChanges()
  console.log(changes)
}

module.exports = listenToSaveableChanges
