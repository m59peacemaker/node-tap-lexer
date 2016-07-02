const getType = require('./get-type')
const rtrim = require('underscore.string/rtrim')
const split = require('split2')
const through = require('through2')

const simpleTapLexer = () => {
  return through.obj(function (chunk, enc, cb) {
    const lines = rtrim(String(chunk)).split('\n')
    lines.forEach(line => {
      console.log(line)
      this.push({
        type: getType(line),
        value: line
      })
    })
    cb()
  })
}

const yamlishLexer = () => {
  return through.obj(function (chunk, enc, cb) {
    this.push(chunk)
    cb()
  })
}

const Parser = () => {
  const stream = split()
  stream
    .pipe(simpleTapLexer())
    .pipe(yamlishLexer())
  return stream
}

module.exports = Parser
