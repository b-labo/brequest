/**
 * Test case for brequest.
 * Runs with mocha.
 */
'use strict'

const BRequest = require('../lib/brequest.js')
const assert = require('assert')
const aport = require('aport')
const http = require('http')
const co = require('co')

describe('brequest', function () {
  this.timeout(3000)
  let server, port, url
  before(() => co(function * () {
    port = yield aport()
    server = http.createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({
        method: req.method,
        url: req.url
      }, null, 2))
    })
    url = `http://localhost:${port}`
    server.listen(port)
  }))

  after(() => co(function * () {
    server.close()
  }))

  it('Get request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.get(url + '/foo', {})
    assert.ok(statusCode, 200)
    assert.deepEqual(body, { method: 'GET', url: '/foo' })
  }))

  it('Head request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.head(url + '/foo', {})
    assert.ok(statusCode, 200)
  }))

  it('Options request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.options(url + '/foo', {})
    assert.ok(statusCode, 200)
    assert.deepEqual(body, { method: 'OPTIONS', url: '/foo' })
  }))

  it('Post request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.post(url + '/foo', {
      id: '1234'
    })
    assert.ok(statusCode, 200)
    assert.deepEqual(body, { method: 'POST', url: '/foo' })
  }))

  it('Patch request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.patch(url + '/foo', {
      id: '1234'
    })
    assert.ok(statusCode, 200)
  }))

  it('DELETE request', () => co(function * () {
    let request = new BRequest({})
    let { body, statusCode } = yield request.delete(url + '/foo', {
      id: '1234'
    })
    assert.ok(statusCode, 200)
  }))
})

/* global describe, before, after, it */
