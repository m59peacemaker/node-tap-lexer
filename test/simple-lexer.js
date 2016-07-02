const test   = require('tape')
const Parser = require('../lib/parser')

test('emits correct types', t => {
  const parser = Parser()
  const types = ['plan', 'test']
  t.plan(types.length)
  parser.on('data', data => {
    t.equal(data.type, types[0])
    types.shift()
  })
  parser.write('1..1\n')
  parser.write('ok 1 should be truthy\n')
  parser.end()
  t.end()
})

test('emits correct types and values', t => {
  const parser = Parser()
  const inputs = [
    [
      'TAP version 13\n',
      '1..1\n',
      'ok 1 should be truthy\n',
    ]
  ].map(arr => arr.join(''))
  const datas = [
    {type: 'version', value: 'TAP version 13\n'},
    {type: 'plan',    value: '1..1\n'},
    {type: 'test',    value: 'ok 1 should be truthy\n'}
  ]
  t.plan(datas.length)
  parser.on('data', data => {
    t.deepEqual(data, datas[0])
    datas.shift()
  })
  inputs.forEach(input => parser.write(input))
  parser.end()
  t.end()
})
