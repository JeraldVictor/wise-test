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
