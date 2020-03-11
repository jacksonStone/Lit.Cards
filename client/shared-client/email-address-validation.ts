let regex = /\S+@\S+\.\S+/;
function emailIsValid (email: string) {
  return regex.test(email);
}

export {
  emailIsValid
};
