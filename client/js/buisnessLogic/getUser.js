const { getUserDetails } = require('api/getUserDetails')
let userDetails

async function fetchUser () {
  if (userDetails) return userDetails
  const userDetailsUnformatted = await getUserDetails()
  try {
    userDetails = JSON.parse(userDetailsUnformatted)
  } catch (e) {
    return userDetailsUnformatted
  }
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
