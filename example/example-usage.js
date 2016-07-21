'use strict'

const brequest = require('brequest')

brequest.get('/foo', { bar: 'baz' })
  .then((res) => {
    /* ... */
  })
  .then((err) => {
    /* ... */
  })
