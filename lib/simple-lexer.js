const through = require('through2')
const getType = require('./get-type')

const simpleLexer = () => {
  return through.obj(function (chunk, enc, cb) {
    const line = String(chunk)
    this.push({
      type: getType(line),
      value: line
    })
    cb()
  })
}

module.exports = simpleLexer
