const types = {
  version: /^TAP version (\w|\.)+$/,
  plan: /^1..\d+$/,
  test: /^(not )?ok\b/,
  bailout: /^Bail out!/,
  diagnostic: /^# /,
  yamlishOpen: /^  ---$/,
  yamlishClose: /^  \.\.\.$/,
  // anything else is "unknown"
}

var fns = Object.keys(types).reduce((acc, type) => {
  const regex = types[type]
  acc[type] = (line) => regex.test(line)
  return acc
}, {})

module.exports = fns
