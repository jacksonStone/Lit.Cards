module.exports = function stale (seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
