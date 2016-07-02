const getType = require('./get-type')
const rtrim = require('underscore.string/rtrim')
const split = require('split2')
const through = require('through2')

const simpleTapLexer = () => {
  return through(function (chunk, enc, cb) {
    const lines = rtrim(String(chunk)).split('\n')
    lines.forEach(line => {
      console.log(line)
      this.push(JSON.stringify({
        type: getType(line),
        value: line
      }))
    })
    cb()
  })
}

const yamlishLexer = () => {
  return through(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

const Parser = () => {
  return split()
    .pipe(simpleTapLexer())
    .pipe(yamlishLexer())
}

module.exports = Parser
