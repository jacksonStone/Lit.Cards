function runNextRender (callback: () => void ) {
  window.requestAnimationFrame(callback)
}
async function waitForState (dataPath: string, callback: () => void ) {
  let waitTime = 20
  let maxWaitTime = 5000
  let iterationMax = (maxWaitTime / waitTime) | 0
  while (window.lc.getData(dataPath) === undefined && iterationMax > 0) {
    iterationMax--
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  return runNextRender(callback)
}

export {
  runNextRender,
  waitForState
}
