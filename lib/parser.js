const split       = require('split2')
const through     = require('through2')
const duplex      = require('duplexer')
const simpleLexer = require('./simple-lexer')
const yamlLexer   = require('./yaml-lexer')
const parse       = require('./parse')

const Parser = () => {
  const splitter = split()
  const fullyParsed = splitter
    .pipe(simpleLexer())
    .pipe(yamlLexer())
    .pipe(through.obj(function (chunk, enc, cb) {
      const result = Object.assign({}, chunk, {parsed: parse(chunk.type, chunk.value)})
      cb(null, result)
    }))
    .pipe(through.obj(function (chunk, enc, cb) {
      chunk.value+= '\n' // add back the newline that `split` removed
      cb(null, chunk)
    }))
  return duplex(splitter, fullyParsed)
}

module.exports = Parser
