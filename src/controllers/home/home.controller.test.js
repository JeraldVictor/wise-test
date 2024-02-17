const { expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../../app')

describe('GET /', function () {
  it('responds with json', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual('OK')
    expect(response.body.message).toEqual('Hello World')
    expect(response.body.success).toEqual(true)
  })
})

describe('GET /Safe', function () {
  it('Throw Error when user is not logged in', async () => {
    const response = await request(app)
      .get('/Safe')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(401)
    expect(response.body.statusCode).toEqual(401)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual('Unauthorized request')
    expect(response.body.success).toEqual(false)
  })
})
