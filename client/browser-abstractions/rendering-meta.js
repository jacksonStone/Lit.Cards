function runNextRender (callback) {
  window.requestAnimationFrame(callback)
}
async function waitForState(dataPath, callback) {
  while(window.lc.getData(dataPath) === undefined) {
    await new Promise(resolve, setTimeout(resolve, 50));
  }
  return runNextRender(callback);
}

module.exports = {
  runNextRender,
  waitForState
}
