let uuidV4 = require('uuid/v4')
module.exports = {
  createId () {
    return uuidV4()
  }
}
