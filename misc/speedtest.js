function speedTestFunction (callback, name = 'untilted', repeats = 1) {
  let sum = 0
  for (let i = 0; i < repeats; i++) {
    const start = Date.now()
    callback()
    const end = Date.now()
    sum += (end - start)
  }
  console.info(`${name} took on average: ${(sum / repeats)} milliseconds`)
}
// DISCOVERIES
// Under 1,000,000ish entries, string appending performs better than array appending, then it flips and gets more pronounced
// Spread only works for about 150,000 entries, after that it starts to fall over
// 1,000,000 obj look ups takes: .02 seconds, or 20 nanoseconds
// 1,000,000 weakmap lookups take: .05 seconds, or 50 nanoseconds, and it's fine on IE 11, go figure
// HTML-sanitize takes under 1 millisecond even for pretty large documents
