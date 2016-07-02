const types = {
  version: /^TAP version (\w|\.)+$/,
  plan: /^1..\d+$/,

  /*
    starts with #
    followed by a space
    optional any character except newline
    ends with newline
  */
  comment: /^# .*$/,

  assert: /^(not )?ok\b/,
  yamlishOpen: /^  ---$/,
  yamlishClose: /^  \.\.\.$/,
}

var fns = Object.keys(types).reduce((acc, type) => {
  const regex = types[type]
  acc[type] = (line) => regex.test(line)
  return acc
}, {})

module.exports = fns
