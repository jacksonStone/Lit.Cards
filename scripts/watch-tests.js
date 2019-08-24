let watch = require('watch')
let path = require('path')
let root = path.resolve(__dirname, '../')
let running = false
let needToRun = false
function runTests() {
  // Prevent concurrent runs, but don't drop run requests
  if(running && needToRun) {
    return
  }
  if(running && !needToRun) {
    needToRun = true;
    return;
  }
  running = true;
  var spawn = require('child_process').spawn,
    testRun = spawn('npm run test', { cwd: root, shell: '/bin/zsh', stdio: 'inherit' });

  testRun.on('exit', function (code) {
    running = false
    if(needToRun) {
      needToRun = false
      runTests()
    }
  });
}
function watchAndRunTests(f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
  } else if (prev === null) {
    runTests()
  } else if (curr.nlink === 0) {
    runTests()
  } else {
    runTests()
  }
}
watch.watchTree(path.resolve(__dirname, '../server'), watchAndRunTests)
watch.watchTree(path.resolve(__dirname, '../client'), watchAndRunTests)
