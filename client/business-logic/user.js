import { getUserDetails } from '../routes/api/user-details'
import { recordAndSetDarkMode } from '../browser-abstractions/darkmode'
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

function user () {
  return userDetails
}
const getUser = user

export {
  fetchUser,
  fetchUserNoCache,
  clearUserData,
  getUser
}
