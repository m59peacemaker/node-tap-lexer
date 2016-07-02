const getType = require('./get-type')
const rtrim = require('underscore.string/rtrim')
const split = require('split2')
const through = require('through2')
const duplex = require('duplexer')

const simpleTapLexer = () => {
  return through.obj(function (chunk, enc, cb) {
    const line = String(chunk)
    this.push({
      type: getType(line),
      value: line
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
  const splitter = split()
  const fullyParsed = splitter
    .pipe(simpleTapLexer())
    .pipe(yamlishLexer())

  return duplex(splitter, fullyParsed)
}

module.exports = Parser
