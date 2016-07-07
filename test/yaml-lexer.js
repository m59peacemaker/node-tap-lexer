const test   = require('tape')
const rtrim  = require('underscore.string/rtrim')
const yamlLexer = require('../lib/yaml-lexer')
const getFixture = require('./lib/get-fixture')

const yamlDocument = getFixture('1.yaml')
const yamlLines = rtrim(yamlDocument).split('\n').map(v => ({type: 'unknown', value: v + '\n'}))

test('emits yaml block when yaml block is last', t => {
  t.plan(1)
  const lexer = yamlLexer()
  const inputs = [
    {type: 'plan', value: '1..1'},
    {type: 'test', value: 'not ok 1 should be truthy'},
    ...yamlLines
  ]
  let counter = 0
  lexer.on('data', data => {
    ++counter
    if (counter === 3) {
      t.deepEqual(data, {type: 'yaml', value: yamlDocument})
    }
  })
  inputs.forEach(input => lexer.write(input))
  lexer.end()
})

test('emits yaml block when there are lines after yaml', t => {
  const lexer = yamlLexer()
  const inputs = [
    {type: 'plan', value: '1..2'},
    {type: 'test', value: 'not ok 1 should be truthy'},
    ...yamlLines,
    {type: 'test', value: 'ok 2 should be truthy'}
  ]
  const datas = [
    {type: 'plan',    value: '1..2'},
    {type: 'test',    value: 'not ok 1 should be truthy'},
    {type: 'yaml', value: yamlDocument},
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

test('does not emit yaml block when previous line is not a test', t => {
  const lexer = yamlLexer()
  const inputs = [
    {type: 'plan', value: '1..2'},
    ...yamlLines,
    {type: 'test', value: 'ok 1 should be truthy'}
  ]
  const datas = [
    {type: 'plan',    value: '1..2'},
    ...yamlLines,
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
