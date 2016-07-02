const test   = require('tape')
const isType = require('../lib/is-type')

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