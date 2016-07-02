const test   = require('tape')
const Parser = require('../lib/parser')
const fs     = require('fs')
const path   = require('path')

const getFixture = name => {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

test.only('parser', t => {
  const parser = Parser()
  const types = ['plan', 'assert']
  t.plan(types.length)
  parser.on('data', data => {
    console.log(JSON.parse(data))
    t.equal(data.type, types[0])
    types.shift()
  })
  parser.push('1..1\n')
  parser.push('ok 1 should be truthy\n')
})

test('parser', t => {
  const parser = Parser()
  const inputs = [
    [
      'TAP version 13',
      '1..1'
    ],
    [
      'ok 1 should be truthy',
    ]
  ].map(arr => arr.join('\n') + '\n')
  const datas = [
    {type: 'version', value: 'TAP version 13\n'},
    {type: 'plan',    value: '1..1\n'},
    {type: 'assert',  value: 'ok 1 should be truthy\n'}
  ]
  t.plan(datas.length)
  parser.on('data', data => {
    t.deepEqual(data, datas[0])
    datas.shift()
  })
  inputs.forEach(input => parser.write(input))
})


const yamlish1 = getFixture('1.yamlish')
test('appends yamlish to assert', t => {
  const parser = Parser()
  const inputs = [
    [
      '1..1',
      'not ok 1 should be truthy',
    ].join('\n') + '\n',
    yamlish1
  ]
  const datas = [
    {type: 'plan', value: '1..1\n'},
    {type: 'assert', value: 'not ok 1 should be truthy\n'+yamlish1}
  ]
  t.plan(datas.length)
  parser.on('data', data => {
    t.deepEqual(data, datas[0])
    datas.shift()
  })
  inputs.forEach(input => parser.write(input))
})
