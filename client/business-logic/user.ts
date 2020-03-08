import { getUserDetails } from '../routes/api/user-details'
import { recordAndSetDarkMode } from '../browser-abstractions/darkmode'
import 'types';

let userDetails: User;
async function fetchUser () :Promise<User> {
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

function fetchUserNoCache () :Promise<User> {
  clearUserData()
  return fetchUser()
}

function user () :User {
  return userDetails
}
const getUser = user

export {
  fetchUser,
  fetchUserNoCache,
  clearUserData,
  getUser
}
