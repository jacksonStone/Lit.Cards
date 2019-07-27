// Allows for easy date.now overrides
const isTest = process.env.NODE_ENV === 'test'
let testNow

module.exports.now = () => {
  if (isTest && testNow !== undefined) {
    return testNow
  }
  return Date.now()
}
if (isTest) {
  module.exports.setTime = (timeInMilli) => {
    testNow = timeInMilli
  }
  module.exports.resetTime = () => {
    testNow = undefined
  }
}
