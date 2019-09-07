let { getUserDetails, setDarkMode, setMiscDetails } = require('../routes/api/user-details')
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
function updateHideProgress(value) {
  return updateMiscUserConfig('hideProgress', value);
}
function updateHideNavigation(value) {
  return updateMiscUserConfig('hideNavigation', value);
}

function updateMiscUserConfig(key, value) {
  return setMiscDetails({[key]: value});
}
function user () {
  return userDetails
}

module.exports = {
  fetchUser,
  fetchUserNoCache,
  clearUserData,
  updateDarkMode,
  updateHideNavigation,
  updateHideProgress,
  getUser: user
}
