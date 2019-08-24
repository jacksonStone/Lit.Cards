let { getUserDetails, setDarkMode } = require('../routes/api/user-details')
let { recordAndSetDarkMode } = require('../browser-abstractions/darkmode')
let userDetails

async function fetchUser () {
  if (userDetails) return userDetails
  let userDetailsUnformatted = await getUserDetails()
  try {
    userDetails = JSON.parse(userDetailsUnformatted)
  } catch (e) {
    return userDetailsUnformatted
  }
  recordAndSetDarkMode(userDetails.darkMode)
  return userDetails
}

function clearUserData () {
  userDetails = undefined
}

function fetchUserNoCache () {
  clearUserData()
  return fetchUser()
}
function updateDarkMode (darkMode) {
  return setDarkMode(darkMode)
}

function user () {
  return userDetails
}

module.exports = {
  fetchUser,
  fetchUserNoCache,
  clearUserData,
  updateDarkMode,
  getUser: user
}
