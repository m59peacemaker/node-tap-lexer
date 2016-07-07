const yaml = require('js-yaml')
const parseTest = require('./parse-test')

const parsers = {
  version: part => {
    const matches = part.match(/TAP version (\S+)/)
    return {version: matches[1]}
  },
  plan: part => {
    const matches = part.match(/^(\d+)\.\.(\d+)( # (.+))?/)
    const result = {
      start: Number(matches[1]),
      end: Number(matches[2]),
      skipAll: false,
      skipReason: ''
    }
    if (matches[3]) {
      result.skipAll = true
      result.skipReason = matches[4]
    }
    return result
  },
  test: parseTest,
  bailout: part => {
    const matches = part.match(/^Bail out! (\w+)/)
    const result = {reason: ''}
    if (matches) {
      result.reason = matches[1]
    }
    return result
  },
  diagnostic: part => {
    const matches = part.match(/^# (.+)/)
    const result = {message: ''}
    if (matches) {
      result.message = matches[1]
    }
    return result
  },
  yaml: part => {
    const lines = part.split('\n')
    const doc = lines.slice(1, lines.length - 2).join('\n')
    return {document: yaml.safeLoad(doc)}
  }
}

const parse = (type, value) => {
  const parser = parsers[type]
  if (parser) {
    return parser(value)
  }
}

module.exports = parse
