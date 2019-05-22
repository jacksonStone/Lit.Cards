const { getUserDetails } = require('api/getUserDetails')
const { recordAndSetDarkMode } = require('abstract/darkmode')
let userDetails

async function fetchUser () {
  if (userDetails) return userDetails
  const userDetailsUnformatted = await getUserDetails()
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

function getUser () {
  return userDetails
}

module.exports = {
  fetchUser,
  fetchUserNoCache,
  clearUserData,
  getUser
}
