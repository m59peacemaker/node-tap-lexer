const types = {
  version: /^TAP version (\S)+$/,
  plan: /^\d+\.\.\d+/,
  test: /^(not )?ok\b/,
  bailout: /^Bail out!/,
  diagnostic: /^# /
}

const getType = line => {
  const found = Object.keys(types)
    .map(key => ({type: key, regex: types[key]}))
    .find(obj => obj.regex.test(line))
  return found ? found.type : 'unknown'
}

module.exports = getType
