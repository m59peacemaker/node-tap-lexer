const test   = require('tape')
const simpleLexer = require('../lib/simple-lexer')

test('emits correct types', t => {
  const inputs = [
    '1..1',
    'ok 1 should be truthy',
    '  ---',
    'meh'
  ]
  const types = ['plan', 'test', 'unknown', 'unknown']
  const lexer = simpleLexer()
  t.plan(types.length)
  lexer.on('data', data => {
    t.equal(data.type, types[0])
    types.shift()
  })
  inputs.forEach(v => lexer.write(v))
  lexer.end()
})

test('emits correct types and values', t => {
  const lexer = simpleLexer()
  const inputs = [
    'TAP version 13',
    '1..1',
    'ok 1 should be truthy',
  ]
  const datas = [
    {type: 'version', value: 'TAP version 13'},
    {type: 'plan',    value: '1..1'},
    {type: 'test',    value: 'ok 1 should be truthy'}
  ]
  t.plan(datas.length)
  lexer.on('data', data => {
    t.deepEqual(data, datas[0])
    datas.shift()
  })
  inputs.forEach(input => lexer.write(input))
  lexer.end()
})
