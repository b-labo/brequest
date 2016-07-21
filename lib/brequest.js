/**
 * @class BRequest
 */
'use strict'

const superagent = require('superagent')
const objnest = require('objnest')

/** @lends BRequest */
class BRequest {

  constructor (conf) {
    const s = this
    /**  Default headers */
    s.defaults = null
    /** Timeout durations */
    s.timeout = 30 * 1000
    Object.assign(s, conf || {})
  }

  _send (instance, options = {}) {
    const s = this
    let { pipe } = options
    delete options.pipe
    return BRequest.toPromise(
      instance
        .set(
          Object.assign({}, s.defaults, options.headers)
        )
        .timeout(options.timeout || s.timeout),
      { pipe }
    )
  }

  /**
   * Send GET request.
   * @param {string} url - URL to send.
   * @param {object} [query] - Query string data
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  get (url, query, options = {}) {
    const s = this
    return s._send(
      superagent.get(url).query(objnest.flatten(query || {})),
      options
    )
  }

  /**
   * Send HEAD request.
   * @param {string} url - URL to send.
   * @param {object} [query] - Query string data
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  head (url, query, options = {}) {
    const s = this
    return s._send(
      superagent.head(url).query(objnest.flatten(query || {})),
      options
    )
  }

  /**
   * Send OPTIONS request.
   * @param {string} url - URL to send.
   * @param {object} [query] - Query string data
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  options (url, query, options) {
    const s = this
    options = options || {}
    return s._send(
      superagent.options(url).query(objnest.flatten(query || {})),
      options
    )
  }

  /**
   * Send POST request.
   * @param {string} url - URL to send.
   * @param {object} data - Send data.
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  post (url, data, options) {
    const s = this
    options = options || {}
    return s._send(
      superagent.post(url, BRequest.format(data)),
      options
    )
  }

  /**
   * Send PATCH request.
   * @param {string} url - URL to send.
   * @param {object} data - Send data.
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  patch (url, data, options) {
    const s = this
    options = options || {}
    return s._send(
      superagent.patch(url, BRequest.format(data)),
      options
    )
  }

  /**
   * Send DELETE request.
   * @param {string} url - URL to send.
   * @param {object} data - Send data.
   * @param {object} [options] - Optional settings
   * @returns {Promise}
   */
  delete (url, data, options) {
    const s = this
    options = options || {}
    return s._send(
      superagent.delete(url).send(data),
      options
    )
  }
}

Object.assign(BRequest, {
  /**
   * Format sending data
   * @param {object} data - Data to format
   * @returns {object} - Formatted src.
   */
  format (data) {
    let result = {}
    for (let key of Object.keys(data || {})) {
      let skip = data[ key ] === null || data[ key ] === undefined
      if (skip) {
        continue
      }
      result[ key ] = data[ key ]
    }
    return result
  },
  /**
   * Convert promise
   * @param instance
   * @param {Object} [options]
   * @returns {Promise}
   */
  toPromise (instance, options = {}) {
    let { pipe } = options
    return new Promise((resolve, reject) => {
      if (pipe) {
        instance.pipe(pipe)
          .on('close', () => resolve())
          .on('error', (err) => reject(err))
      } else {
        instance.end((err, res) =>
          err ? reject(err) : resolve(res)
        )
      }
    })
  },
  superagent: superagent
})

module.exports = BRequest
