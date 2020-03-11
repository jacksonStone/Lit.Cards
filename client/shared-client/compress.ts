// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
// with modifications by Jackson  Stone
// private property
/* eslint-disable */
let f = String.fromCharCode
let ownProp = Object.prototype.hasOwnProperty
export let LZString = {
  jcompress: function (inputObj: Object) {
    return LZString.compress(JSON.stringify(inputObj))
  },
  jdecompress: function (compressed: string) {
    return JSON.parse(LZString.decompress(compressed))
  },
  compress: function (input: string) {
    if (input == null) return ''
    return LZString._compress(input, 15, function (a:number) { return f(a + 32) }) + ' '
  },
  decompress: function (compressed: string) {
    if (compressed == null) return ''
    if (compressed == '') return null
    return LZString._decompress(compressed.length, 16384, function (index:number) { return compressed.charCodeAt(index) - 32 })
  },
  _compress: function (uncompressed: string, bitsPerChar: number, cfi: (index: number) => string) {
    if (uncompressed == null) return ''
    let i; let value
    let cd: {[key: string]: any} = {}
    let ctx_dictionaryToCreate: {[key: string]: any} = {}
    let ctx_c = ''
    let ctx_wc = ''
    let ctx_w = ''
    let ctx_enlargeIn = 2 // Compensate for the first entry which should not count
    let ctx_dictSize = 3
    let ctx_numBits = 2
    let ctx_d = []
    let ctx_d_val = 0
    let ctx_d_position = 0
    let ii

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      ctx_c = uncompressed.charAt(ii)
      if (!ownProp.call(cd, ctx_c)) {
        cd[ctx_c] = ctx_dictSize++
        ctx_dictionaryToCreate[ctx_c] = true
      }

      ctx_wc = ctx_w + ctx_c
      if (ownProp.call(cd, ctx_wc)) {
        ctx_w = ctx_wc
      } else {
        if (ownProp.call(ctx_dictionaryToCreate, ctx_w)) {
          if (ctx_w.charCodeAt(0) < 256) {
            for (i = 0; i < ctx_numBits; i++) {
              ctx_d_val = (ctx_d_val << 1)
              if (ctx_d_position == bitsPerChar - 1) {
                ctx_d_position = 0
                ctx_d.push(cfi(ctx_d_val))
                ctx_d_val = 0
              } else {
                ctx_d_position++
              }
            }
            value = ctx_w.charCodeAt(0)
            for (i = 0; i < 8; i++) {
              ctx_d_val = (ctx_d_val << 1) | (value & 1)
              if (ctx_d_position == bitsPerChar - 1) {
                ctx_d_position = 0
                ctx_d.push(cfi(ctx_d_val))
                ctx_d_val = 0
              } else {
                ctx_d_position++
              }
              value = value >> 1
            }
          } else {
            value = 1
            for (i = 0; i < ctx_numBits; i++) {
              ctx_d_val = (ctx_d_val << 1) | value
              if (ctx_d_position == bitsPerChar - 1) {
                ctx_d_position = 0
                ctx_d.push(cfi(ctx_d_val))
                ctx_d_val = 0
              } else {
                ctx_d_position++
              }
              value = 0
            }
            value = ctx_w.charCodeAt(0)
            for (i = 0; i < 16; i++) {
              ctx_d_val = (ctx_d_val << 1) | (value & 1)
              if (ctx_d_position == bitsPerChar - 1) {
                ctx_d_position = 0
                ctx_d.push(cfi(ctx_d_val))
                ctx_d_val = 0
              } else {
                ctx_d_position++
              }
              value = value >> 1
            }
          }
          ctx_enlargeIn--
          if (ctx_enlargeIn == 0) {
            ctx_enlargeIn = Math.pow(2, ctx_numBits)
            ctx_numBits++
          }
          delete ctx_dictionaryToCreate[ctx_w]
        } else {
          value = cd[ctx_w]
          for (i = 0; i < ctx_numBits; i++) {
            ctx_d_val = (ctx_d_val << 1) | (value & 1)
            if (ctx_d_position == bitsPerChar - 1) {
              ctx_d_position = 0
              ctx_d.push(cfi(ctx_d_val))
              ctx_d_val = 0
            } else {
              ctx_d_position++
            }
            value = value >> 1
          }
        }
        ctx_enlargeIn--
        if (ctx_enlargeIn == 0) {
          ctx_enlargeIn = Math.pow(2, ctx_numBits)
          ctx_numBits++
        }
        // Add wc to the dictionary.
        cd[ctx_wc] = ctx_dictSize++
        ctx_w = String(ctx_c)
      }
    }

    // Output the code for w.
    if (ctx_w !== '') {
      if (ownProp.call(ctx_dictionaryToCreate, ctx_w)) {
        if (ctx_w.charCodeAt(0) < 256) {
          for (i = 0; i < ctx_numBits; i++) {
            ctx_d_val = (ctx_d_val << 1)
            if (ctx_d_position == bitsPerChar - 1) {
              ctx_d_position = 0
              ctx_d.push(cfi(ctx_d_val))
              ctx_d_val = 0
            } else {
              ctx_d_position++
            }
          }
          value = ctx_w.charCodeAt(0)
          for (i = 0; i < 8; i++) {
            ctx_d_val = (ctx_d_val << 1) | (value & 1)
            if (ctx_d_position == bitsPerChar - 1) {
              ctx_d_position = 0
              ctx_d.push(cfi(ctx_d_val))
              ctx_d_val = 0
            } else {
              ctx_d_position++
            }
            value = value >> 1
          }
        } else {
          value = 1
          for (i = 0; i < ctx_numBits; i++) {
            ctx_d_val = (ctx_d_val << 1) | value
            if (ctx_d_position == bitsPerChar - 1) {
              ctx_d_position = 0
              ctx_d.push(cfi(ctx_d_val))
              ctx_d_val = 0
            } else {
              ctx_d_position++
            }
            value = 0
          }
          value = ctx_w.charCodeAt(0)
          for (i = 0; i < 16; i++) {
            ctx_d_val = (ctx_d_val << 1) | (value & 1)
            if (ctx_d_position == bitsPerChar - 1) {
              ctx_d_position = 0
              ctx_d.push(cfi(ctx_d_val))
              ctx_d_val = 0
            } else {
              ctx_d_position++
            }
            value = value >> 1
          }
        }
        ctx_enlargeIn--
        if (ctx_enlargeIn == 0) {
          ctx_enlargeIn = Math.pow(2, ctx_numBits)
          ctx_numBits++
        }
        delete ctx_dictionaryToCreate[ctx_w]
      } else {
        value = cd[ctx_w]
        for (i = 0; i < ctx_numBits; i++) {
          ctx_d_val = (ctx_d_val << 1) | (value & 1)
          if (ctx_d_position == bitsPerChar - 1) {
            ctx_d_position = 0
            ctx_d.push(cfi(ctx_d_val))
            ctx_d_val = 0
          } else {
            ctx_d_position++
          }
          value = value >> 1
        }
      }
      ctx_enlargeIn--
      if (ctx_enlargeIn == 0) {
        ctx_enlargeIn = Math.pow(2, ctx_numBits)
        ctx_numBits++
      }
    }

    // Mark the end of the stream
    value = 2
    for (i = 0; i < ctx_numBits; i++) {
      ctx_d_val = (ctx_d_val << 1) | (value & 1)
      if (ctx_d_position == bitsPerChar - 1) {
        ctx_d_position = 0
        ctx_d.push(cfi(ctx_d_val))
        ctx_d_val = 0
      } else {
        ctx_d_position++
      }
      value = value >> 1
    }

    // Flush the last char
    while (true) {
      ctx_d_val = (ctx_d_val << 1)
      if (ctx_d_position == bitsPerChar - 1) {
        ctx_d.push(cfi(ctx_d_val))
        break
      } else ctx_d_position++
    }
    return ctx_d.join('')
  },
  _decompress: function (length: number, resetValue: number, gnv:  (index: number) => number) {
    let dictionary: Array<number|string> = []
    let next
    let enlargeIn = 4
    let dictSize = 4
    let numBits = 3
    let entry = ''
    let result = []
    let i
    let w
    let bits; let resb; let maxpower; let power
    let c
    let d = { val: gnv(0), position: resetValue, index: 1 }

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i
    }

    bits = 0
    maxpower = Math.pow(2, 2)
    power = 1
    while (power != maxpower) {
      resb = d.val & d.position
      d.position >>= 1
      if (d.position == 0) {
        d.position = resetValue
        d.val = gnv(d.index++)
      }
      bits |= (resb > 0 ? 1 : 0) * power
      power <<= 1
    }

    switch (next = bits) {
      case 0:
        bits = 0
        maxpower = Math.pow(2, 8)
        power = 1
        while (power != maxpower) {
          resb = d.val & d.position
          d.position >>= 1
          if (d.position == 0) {
            d.position = resetValue
            d.val = gnv(d.index++)
          }
          bits |= (resb > 0 ? 1 : 0) * power
          power <<= 1
        }
        c = f(bits)
        break
      case 1:
        bits = 0
        maxpower = Math.pow(2, 16)
        power = 1
        while (power != maxpower) {
          resb = d.val & d.position
          d.position >>= 1
          if (d.position == 0) {
            d.position = resetValue
            d.val = gnv(d.index++)
          }
          bits |= (resb > 0 ? 1 : 0) * power
          power <<= 1
        }
        c = f(bits)
        break
      case 2:
        return ''
    }
    dictionary[3] = c
    w = c
    result.push(c)
    while (true) {
      if (d.index > length) {
        return ''
      }

      bits = 0
      maxpower = Math.pow(2, numBits)
      power = 1
      while (power != maxpower) {
        resb = d.val & d.position
        d.position >>= 1
        if (d.position == 0) {
          d.position = resetValue
          d.val = gnv(d.index++)
        }
        bits |= (resb > 0 ? 1 : 0) * power
        power <<= 1
      }

      switch (c = bits) {
        case 0:
          bits = 0
          maxpower = Math.pow(2, 8)
          power = 1
          while (power != maxpower) {
            resb = d.val & d.position
            d.position >>= 1
            if (d.position == 0) {
              d.position = resetValue
              d.val = gnv(d.index++)
            }
            bits |= (resb > 0 ? 1 : 0) * power
            power <<= 1
          }

          dictionary[dictSize++] = f(bits)
          c = dictSize - 1
          enlargeIn--
          break
        case 1:
          bits = 0
          maxpower = Math.pow(2, 16)
          power = 1
          while (power != maxpower) {
            resb = d.val & d.position
            d.position >>= 1
            if (d.position == 0) {
              d.position = resetValue
              d.val = gnv(d.index++)
            }
            bits |= (resb > 0 ? 1 : 0) * power
            power <<= 1
          }
          dictionary[dictSize++] = f(bits)
          c = dictSize - 1
          enlargeIn--
          break
        case 2:
          return result.join('')
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits)
        numBits++
      }

      if (dictionary[c]) {
        entry = <string>dictionary[c]
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0)
        } else {
          return null
        }
      }
      result.push(entry)

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0)
      enlargeIn--

      w = entry

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits)
        numBits++
      }
    }
  }
}
