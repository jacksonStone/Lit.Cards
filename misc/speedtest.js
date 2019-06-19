function speedTestFunction (callback, name = 'untilted', repeats = 1) {
  let sum = 0
  for (let i = 0; i < repeats; i++) {
    const start = Date.now()
    callback()
    const end = Date.now()
    sum += (end - start)
  }
  console.log(sum)
  console.info(`${name} took on average: ${(sum / repeats) / 1000} seconds`)
}

// DISCOVERIES
// Under 1,000,000ish entries, string appending performs better than array appending, then it flips and gets more pronounced
// Spread only works for about 150,000 entries, after that it starts to fall over
