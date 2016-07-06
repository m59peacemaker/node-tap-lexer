const types = {
  version: /^TAP version (\w|\.)+$/,
  plan: /^\d+\.\.\d+/,
  test: /^(not )?ok\b/,
  bailout: /^Bail out!/,
  diagnostic: /^# /,
  // anything else is "unknown"
}

const getType = line => {
  const found = Object.keys(types)
    .map(key => ({type: key, regex: types[key]}))
    .find(obj => obj.regex.test(line))
  return found ? found.type : 'unknown'
}

module.exports = getType
