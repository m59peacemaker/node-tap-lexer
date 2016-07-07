#!/usr/bin/env node

const lexer = require('../')
const through = require('through2')

process.stdin
  .pipe(lexer())
  .pipe(through.obj(function (chunk, enc, cb) {
    cb(null, JSON.stringify(chunk) + '\n')
  }))
  .pipe(process.stdout)
