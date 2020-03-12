const instrumentMap = require('./instrument-map')

module.exports = instrumentID => {
  for (const type in instrumentMap) {
    for (const key in instrumentMap[type]) {
      if (key == instrumentID) return type
    }
  }

  return 'stocks'
}
