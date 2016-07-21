/**
 * @function create
 */

'use strict'

const BRequest = require('./brequest')

/** @lends create */
function create (conf) {
  return new BRequest(conf)
}

module.exports = create
