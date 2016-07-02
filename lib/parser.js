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
      value: line + '\n' // add back the newline that `split` removed
    })
    cb()
  })
}

const yamlishLexer = () => {
  let lastType = undefined
  let processing = false
  const lines = []
  return through.obj(function (chunk, enc, cb) {
    if (processing) {
      lines.push(chunk.value)
      if (chunk.type === 'yamlishClose') {
        processing = false
        lastType = undefined
        this.push({type: 'yamlish', value: lines.join('')})
      }
      return cb()
    }
    if (chunk.type === 'yamlishOpen' && lastType === 'test') {
      processing = true
      lines.push(chunk.value)
      return cb()
    }
    lastType = chunk.type
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
