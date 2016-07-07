const test = require('tape')
const lexer = require('../')
const getFixture = require('./lib/get-fixture')
const rtrim = require('underscore.string/rtrim')

const format = a => ({type: a[0], value: a[1]})

;[
  ['version', 'TAP version 13'],
  ['plan', '1..5 # Stuff'],
  ['bailout', 'Bail out!'],
  ['bailout', 'Bail out! Things happened.'],
  ['diagnostic', '# Hey.'],
  ['test', 'ok 1 should be truthy']
]
.map(format)
.forEach(i => {
  test(`lexer: ${i.type}`, t => {
    t.plan(1)
    const stream = lexer()
    stream.on('data', d => {
      t.deepEqual(d, i)
    })
    stream.write(i.value)
    stream.end()
  })
})

;[
  [
    ['test', 'ok 1 should be truthy\n'],
    ['yaml', '  ---\ngibberish\n  ...\n']
  ],
  [
    ['test', 'ok 1 should be truthy\n'],
    ['yaml', getFixture('1.yaml')]
  ],
  [
    ['plan', '1..5\n'],
    ['unknown', '  ---\n']
  ]
]
.map(arr => arr.map(format))
.forEach(set => {
  test('lexer - multiple', t => {
    t.plan(set.length)
    const stream = lexer()
    stream.on('data', d => {
      const item = set[t.assertCount]
      item.value = rtrim(item.value)
      t.deepEqual(d, item)
    })
    set.forEach(obj => {
      stream.write(obj.value)
    })
    stream.end()
  })
})
