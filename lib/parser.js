const WritableStream = require('stream').Writable
const getType = require('./get-type')
const rtrim = require('underscore.string/rtrim')
const EventEmitter = require('events')

const notDone = {done: false}
const Handler = () => {
  const lines = []
  let yamlishOpen = false
  return (line) => {
    const lineType = getType(line)
    lines.push(line)
    if (lines.length === 2) {
      const l1t = getType(lines[0])
      const l2t = getType(lines[1])
      if (l2t !== 'yamlishOpen' && !yamlishOpen) {
        return {
          done: true,
          type: l1t,
          value: lines[0] + '\n'
        }
      }
      if (l2t === 'yamlishOpen') {
        yamlishOpen = true
        return notDone
      }
    }
    return notDone
  }
}

const Parser = () => {

  let handler = Handler(emitter)
  let asserts = 0
  let assertsPlanned = undefined

  var emitter = new EventEmitter()
  emitter.on('assert', () => ++asserts)
  emitter.on('plan', (line) => {
    assertsPlanned = Number(line.split('..')[1])
  })

  const w = new WritableStream({
    write(chunk, encoding, cb) {
      const lines = rtrim(String(chunk)).split('\n')
      lines.forEach(line => {
        emitter.emit(getType(line), line)
        var result = handler(line)
        if (result.done) {
          w.emit('data', {type: result.type, value: result.value})
          handler = Handler(emitter)
          handler(line)
        }
        if (assertsPlanned && asserts === assertsPlanned) {
          assertsPlanned = 0 // gate this off for any additional lines that may come in
          w.write('') // force the handler to finish
        }
      })
      cb()
    }
  })
  return w
}

module.exports = Parser
