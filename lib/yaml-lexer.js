const through = require('through2')

const isUnknown = chunk => chunk.type === 'unknown'
const isOpen = chunk => isUnknown(chunk) && /^ +---$/.test(chunk.value)
const isClose = chunk => isUnknown(chunk) && /^ +\.\.\.$/.test(chunk.value)

const yamlLexer = () => {
  let lastType = undefined
  let processing = false
  let lines = []
  return through.obj(function (chunk, enc, cb) {
    if (processing) {
      lines.push(chunk.value)
      if (isClose(chunk)) {
        processing = false
        lastType = undefined
        this.push({type: 'yaml', value: lines.join('\n')})
        lines = []
      }
      return cb()
    }
    if (isOpen(chunk) && lastType === 'test') {
      processing = true
      lines.push(chunk.value)
      return cb()
    }
    lastType = chunk.type
    this.push(chunk)
    cb()
  })
}

module.exports = yamlLexer
