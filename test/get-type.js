const test   = require('tape')
const getType = require('../lib/get-type')

test('getType returns the correct type for a TAP string', t => {
  t.plan(2)
  t.equal(getType('# hey'), 'diagnostic')
  t.equal(getType('meh'), 'unknown')
  t.end()
})
