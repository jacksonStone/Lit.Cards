let regex = /\S+@\S+\.\S+/;
function emailIsValid (email) {
  return regex.test(email);
}

export {
  emailIsValid
};
