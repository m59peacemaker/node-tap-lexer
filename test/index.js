const test   = require('tape')
const Parser = require('../lib/parser')
const isType = require('../lib/is-type')
const fs     = require('fs')
const path   = require('path')

const getFixture = name => {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
}

test('isType.comment', t => {
  t.plan(4)

  t.true(isType.comment('# foo bar'))

  t.false(isType.comment('#foo bar'))
  t.false(isType.comment('foo bar'))
  t.false(isType.comment('foo # bar'))
})

test('isType.assert', t => {
  t.plan(4)

  t.true(isType.assert('ok 1 should be truthy'))
  t.true(isType.assert('not ok 5 should be equal'))

  t.false(isType.assert('meh'))
  t.false(isType.assert('  ---'))
})

test('isType.plan', t => {
  t.plan(6)

  t.true(isType.plan('1..1'))
  t.true(isType.plan('1..10'))
  t.true(isType.plan('1..456'))

  t.false(isType.plan('1..b'))
  t.false(isType.plan('b..123'))
  t.false(isType.plan('1.5'))
})

test('isType.version', t => {
  t.plan(4)

  t.true(isType.version('TAP version 13'))
  t.true(isType.version('TAP version 1.b'))

  t.false(isType.version('TAP version 1 3'))
  t.false(isType.version('TAP version 1 b'))
})

test('isType.yamlishOpen', t => {
  t.plan(4)

  t.true(isType.yamlishOpen('  ---'))

  t.false(isType.yamlishOpen(' ---'))
  t.false(isType.yamlishOpen('  --- '))
  t.false(isType.yamlishOpen('  -b-'))
})

test('isType.yamlishClose', t => {
  t.plan(4)

  t.true(isType.yamlishClose('  ...'))

  t.false(isType.yamlishClose(' ...'))
  t.false(isType.yamlishClose('  ... '))
  t.false(isType.yamlishClose('  .b.'))
})

test('parser', t => {
  const parser = Parser()
  const types = ['plan', 'assert']
  t.plan(types.length)
  parser.on('data', data => {
    t.equal(data.type, types[0])
    types.shift()
  })
  parser.write('1..1')
  parser.write('ok 1 should be truthy\n')
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
