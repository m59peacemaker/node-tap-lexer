const test   = require('tape')
const Parser = require('../lib/parser')
const fs     = require('fs')
const path   = require('path')
const rtrim  = require('underscore.string/rtrim')

const getFixture = name => {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

const yamlish1 = getFixture('1.yamlish')
test('emits yamlish block when yamlish block is last', t => {
  const parser = Parser()
  const inputs = [
    [
      '1..1\n',
      'not ok 1 should be truthy\n',
    ].join(''),
    yamlish1
  ]
  const datas = [
    {type: 'plan',    value: '1..1\n'},
    {type: 'test',    value: 'not ok 1 should be truthy\n'},
    {type: 'yamlish', value: yamlish1}
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

test('emits yamlish block when there are lines after yamlish', t => {
  const parser = Parser()
  const inputs = [
    [
      '1..2\n',
      'not ok 1 should be truthy\n',
    ].join(''),
    yamlish1,
    'ok 1 should be truthy\n'
  ]
  const datas = [
    {type: 'plan',    value: '1..2\n'},
    {type: 'test',    value: 'not ok 1 should be truthy\n'},
    {type: 'yamlish', value: yamlish1},
    {type: 'test',    value: 'ok 1 should be truthy\n'},
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

const yamlishLines = rtrim(yamlish1).split('\n')

// yamlishOpen, bunch of unknowns, yamlishClose
const yamlishDatas = yamlishLines
  .map(line => ({type: 'unknown', value: line}))
  .map((obj, i) => {
    console.log(i)
    if (i === 0) {
      obj.type = 'yamlishOpen'
    }
    if (i === yamlishLines.length - 1) {
      obj.type = 'yamlishClose'
    }
    return obj
  })

test('does not emit yamlish block when previous line is not a test', t => {
  const parser = Parser()
  const inputs = [
    '1..2\n',
    yamlish1,
    'ok 1 should be truthy\n'
  ]
  const datas = [
    {type: 'plan',    value: '1..2\n'},
    ...yamlishDatas,
    {type: 'test',    value: 'ok 1 should be truthy\n'},
  ]
  t.plan(datas.length)
  parser.on('data', data => {
    t.equal(data.type, datas[0].type)
    datas.shift()
  })
  inputs.forEach(input => parser.write(input))
  parser.end()
  t.end()
})
