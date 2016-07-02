const test   = require('tape')
const getType = require('../lib/get-type')

test('get type', t => {
  t.plan(2)
  t.equal(getType('# hey'), 'diagnostic')
  t.equal(getType('meh'), 'unknown')
  t.end()
})
