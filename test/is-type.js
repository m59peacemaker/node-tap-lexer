const test   = require('tape')
const isType = require('../lib/is-type')

test('isType.version', t => {
  t.plan(4)

  t.true(isType.version('TAP version 13'))
  t.true(isType.version('TAP version 1.b'))

  t.false(isType.version('TAP version 1 3'))
  t.false(isType.version('TAP version 1 b'))
  t.end()
})

test('isType.plan', t => {
  t.plan(6)

  t.true(isType.plan('1..1'))
  t.true(isType.plan('1..10'))
  t.true(isType.plan('1..456'))

  t.false(isType.plan('1..b'))
  t.false(isType.plan('b..123'))
  t.false(isType.plan('1.5'))
  t.end()
})

test('isType.test', t => {
  t.plan(4)

  t.true(isType.test('ok 1 should be truthy'))
  t.true(isType.test('not ok 5 should be equal'))

  t.false(isType.test('meh'))
  t.false(isType.test('  ---'))
  t.end()
})

test('isType.bailout', t => {
  t.plan(6)

  t.true(isType.bailout('Bail out!'))
  t.true(isType.bailout('Bail out! Bail out!'))
  t.true(isType.bailout('Bail out! For reasons.'))

  t.false(isType.bailout('Bail out'))
  t.false(isType.bailout('Bail out For reasons.'))
  t.false(isType.bailout('Bail out For reasons!'))
  t.end()
})

test('isType.diagnostic', t => {
  t.plan(4)

  t.true(isType.diagnostic('# foo bar'))

  t.false(isType.diagnostic('#foo bar'))
  t.false(isType.diagnostic('foo bar'))
  t.false(isType.diagnostic('foo # bar'))
  t.end()
})

test('isType.yamlishOpen', t => {
  t.plan(4)

  t.true(isType.yamlishOpen('  ---'))

  t.false(isType.yamlishOpen(' ---'))
  t.false(isType.yamlishOpen('  --- '))
  t.false(isType.yamlishOpen('  -b-'))
  t.end()
})

test('isType.yamlishClose', t => {
  t.plan(4)

  t.true(isType.yamlishClose('  ...'))

  t.false(isType.yamlishClose(' ...'))
  t.false(isType.yamlishClose('  ... '))
  t.false(isType.yamlishClose('  .b.'))
  t.end()
})
