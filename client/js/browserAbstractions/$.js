exports.$ = function () {
  if (arguments.length < 2) {
    return window.document.querySelector.apply(document, arguments)
  }
  return arguments[0].querySelector(arguments[1])
}
