const split        = require('split2')
const through      = require('through2')
const duplex       = require('duplexer')
const simpleLexer  = require('./simple-lexer')
const yamlishLexer = require('./yamlish-lexer')

const Parser = () => {
  const splitter = split()
  const fullyParsed = splitter
    .pipe(simpleLexer())
    .pipe(yamlishLexer())
    .pipe(through.obj(function (chunk, enc, cb) {
      chunk.value+= '\n' // add back the newline that `split` removed
      cb(null, chunk)
    }))
  return duplex(splitter, fullyParsed)
}

module.exports = Parser
