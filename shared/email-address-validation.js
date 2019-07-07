const regex = /\S+@\S+\.\S+/;
function emailIsValid (email) {
  return regex.test(email);
}
module.exports = {
  emailIsValid
}
