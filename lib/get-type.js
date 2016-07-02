const isType = require('./is-type')

const getType = (line) => {
  let type = undefined
  Object.keys(isType).some(t => {
    const result = isType[t](line)
    if (result === true) {
      type = t
    }
    return result
  })
  return type || 'unknown'
}

module.exports = getType
