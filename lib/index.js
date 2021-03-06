/**
 * HTTP client for browsers
 * @module brequest
 */

"use strict";

const create = require('./create')
const BRequest = require('./brequest')

let lib = create({})

Object.assign(lib, {
  BRequest,
  create,
  superagent: BRequest.superagent
})

module.exports = lib
