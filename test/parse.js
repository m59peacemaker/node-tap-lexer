const test = require('tape')
const parse = require('../lib/parse')
const getFixture = require('./lib/get-fixture')

const m = (...objects) => {
  return Object.assign({}, ...objects)
}

const testObj = {
  ok: false,
  point: undefined,
  description: undefined,
  skip: undefined,
  todo: undefined
}

const data = {
  version: [
    [
      'TAP version 13',
      {version: '13'}
    ],
    [
      'TAP version 1.5b',
      {version: '1.5b'}
    ]
  ],
  plan: [
    [
      '1..5',
      {start: 1, end: 5, skipAll: false, skipReason: ''}
    ],
    [
      '1..0 # Skipped: WWW::Mechanize not installed',
      {start: 1, end: 0, skipAll: true, skipReason: 'Skipped: WWW::Mechanize not installed'}
    ]
  ],
  test: [
    [
      'ok',
      m(testObj, {ok: true})
    ],
    [
      'ok 1',
      m(testObj, {ok: true, point: 1})
    ],
    [
      'not ok 1',
      m(testObj, {ok: false, point: 1})
    ],
    [
      'not ok cuz',
      m(testObj, {ok: false, description: 'cuz'})
    ],
    [
      'ok 5 should be truthy',
      m(testObj, {ok: true, point: 5, description: 'should be truthy'})
    ],
    [
      'ok 5 # skip',
      m(testObj, {ok: true, point: 5, skip: true})
    ],
    [
      'ok 5 foo # skip bar',
      m(testObj, {ok: true, point: 5, description: 'foo', skip: 'bar'})
    ],
    [
      'ok 5 # skip bro',
      m(testObj, {ok: true, point: 5, skip: 'bro'})
    ],
    [
      'ok 5 # SKIP skip bro!',
      m(testObj, {ok: true, point: 5, skip: 'skip bro!'})
    ],
    [
      'ok 1 # TODO',
      m(testObj, {ok: true, point: 1, todo: true})
    ],
    [
      'ok foo # TODO the things',
      m(testObj, {ok: true, description: 'foo', todo: 'the things'})
    ]
  ],
  bailout: [
    [
      'Bail out!',
      {reason: ''}
    ],
    [
      'Bail out! hey',
      {reason: 'hey'}
    ]
  ],
  diagnostic: [
    [
      '# like a fool',
      {message: 'like a fool'}
    ]
  ],
  yaml: [
    [
      getFixture('1.yaml'),
      {document: JSON.parse(getFixture('1.json'))}
    ]
  ]
}

Object.keys(data).forEach(k => {
  const sets = data[k]
  sets.forEach(set => {
    const input = set[0]
    test(`parse ${k}: ${input.split('\n')[0]}`, t => {
      t.plan(1)
      t.deepEqual(parse(k, input), set[1])
    })
  })
})
