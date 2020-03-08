export const $ = function (...args: Array<string|HTMLElement>) {
  if (args.length < 2) {
    return window.document.querySelector.apply(document, args)
  }
  return (<HTMLElement>args[0]).querySelector(<string>args[1])
}
