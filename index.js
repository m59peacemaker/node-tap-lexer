const split       = require('split2')
const through     = require('through2')
const duplex      = require('duplexer')
const simpleLexer = require('./lib/simple-lexer')
const yamlLexer   = require('./lib/yaml-lexer')

const lexer = () => {
  const splitter = split()
  const fullyParsed = splitter
    .pipe(simpleLexer())
    .pipe(yamlLexer())
  return duplex(splitter, fullyParsed)
}

module.exports = lexer
