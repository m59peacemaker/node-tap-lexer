const test   = require('tape')
const getType = require('../lib/get-type')

const data = {
  version: [
    [
      'TAP version 13',
      'TAP version 1.b'
    ],
    [
      'TAP version 1 3',
      'TAP version 1 b'
    ]
  ],
  plan: [
    [
      '1..1',
      '1..10',
      '1..456',
      '5653..12345'
    ],
    [
      '1..b',
      'b..123',
      '1.5'
    ]
  ],
  test: [
    [
      'ok 1 should be truthy',
      'not ok 5 should be equal'
    ],
    [
      'meh',
      '  ---'
    ]
  ],
  bailout: [
    [
      'Bail out!',
      'Bail out! Bail out!',
      'Bail out! For reasons.'
    ],
    [
      'Bail out',
      'Bail out For reasons.',
      'Bail out For reasons!'
    ]
  ],
  diagnostic: [
    [
      '# foo bar'
    ],
    [
      '#foo bar',
      'foo bar',
      'foo # bar'
    ]
  ]
}

Object.keys(data).forEach(k => {
  const v = data[k]
  v[0].forEach(v => test(`${k}: ${v}`, t => {
    t.plan(1)
    t.equal(k, getType(v))
  }))
  v[1].forEach(v => test(`${k}: ${v}`, t => {
    t.plan(1)
    t.notEqual(k, getType(v))
  }))
})
