const test   = require('tape')
const fs     = require('fs')
const path   = require('path')
const rtrim  = require('underscore.string/rtrim')
const yamlishLexer = require('../lib/yamlish-lexer')

const getFixture = name => {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

const yamlishDocument = getFixture('1.yamlish')
const yamlishLines = rtrim(yamlishDocument).split('\n').map(v => ({type: 'unknown', value: v + '\n'}))

test('emits yamlish block when yamlish block is last', t => {
  t.plan(1)
  const lexer = yamlishLexer()
  const inputs = [
    {type: 'plan', value: '1..1'},
    {type: 'test', value: 'not ok 1 should be truthy'},
    ...yamlishLines
  ]
  let counter = 0
  lexer.on('data', data => {
    ++counter
    if (counter === 3) {
      t.deepEqual(data, {type: 'yamlish', value: yamlishDocument})
    }
  })
  inputs.forEach(input => lexer.write(input))
  lexer.end()
})

test('emits yamlish block when there are lines after yamlish', t => {
  const lexer = yamlishLexer()
  const inputs = [
    {type: 'plan', value: '1..2'},
    {type: 'test', value: 'not ok 1 should be truthy'},
    ...yamlishLines,
    {type: 'test', value: 'ok 2 should be truthy'}
  ]
  const datas = [
    {type: 'plan',    value: '1..2'},
    {type: 'test',    value: 'not ok 1 should be truthy'},
    {type: 'yamlish', value: yamlishDocument},
    {type: 'test',    value: 'ok 2 should be truthy'},
  ]
  t.plan(datas.length)
  lexer.on('data', data => {
    t.deepEqual(data, datas[0])
    datas.shift()
  })
  inputs.forEach(input => lexer.write(input))
  lexer.end()
})

test('does not emit yamlish block when previous line is not a test', t => {
  const lexer = yamlishLexer()
  const inputs = [
    {type: 'plan', value: '1..2'},
    ...yamlishLines,
    {type: 'test', value: 'ok 1 should be truthy'}
  ]
  const datas = [
    {type: 'plan',    value: '1..2'},
    ...yamlishLines,
    {type: 'test',    value: 'ok 1 should be truthy'},
  ]
  t.plan(datas.length)
  lexer.on('data', data => {
    t.equal(data.type, datas[0].type)
    datas.shift()
  })
  inputs.forEach(input => lexer.write(input))
  lexer.end()
})
