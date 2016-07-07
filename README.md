# tap-lexer

Receives a stream of TAP lines and emits JS objects of types and values.

## Install

```sh
npm install tap-lexer
```

## Usage

```js
const tapLexer = require('tap-lexer')
const through  = require('through2')

process.stdin // stream that emits TAP
  .pipe(tapLexer())
  .pipe(though.obj(function (chunk, enc, cb) { // objectMode stream
    // `chunk` is a TAP token object
  }))

process.stdin
  .pipe(tapLexer())
  .on('data', token => {})

```

- `token: object`
  - `type:  string, unknown`
    - version
    - plan
    - test
    - bailout
    - diagnostic
    - yaml
    - unknown
  - `value: string` the value of the input associated with a type (the "plan" line if type is "plan")
