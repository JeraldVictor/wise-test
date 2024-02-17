const { expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../../app.js')
const { User } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function.js')

beforeAll(async () => {
  // Clears the database
  await User.destroy({
    truncate: true,
  })

  // Create 1 user in the database for testing
  await newUser({
    name: 'john',
    user_name: 'john',
    password: 'john',
  })
})

describe('POST /Auth/Login', () => {
  it('Send valid user_name and Password -> Login success', async () => {
    const response = await request(app)
      .post('/Auth/Login')
      .send({
        user_name: 'john',
        password: 'john',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    const expected = expect.objectContaining({
      accessToken: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        user_name: expect.any(String),
        password: expect.any(String),
      }),
    })

    expect(response.status).toEqual(201)
    expect(response.body.statusCode).toEqual(201)
    expect(response.body.data).toEqual(expected)
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('Users loggedin successfully')
    expect(response.header).toHaveProperty('set-cookie', [
      `accessToken=${response.body.data.accessToken}; Path=/; HttpOnly`,
    ])
  })

  it('Send in-valid user_name and Password -> Login failed', async () => {
    const response = await request(app)
      .post('/Auth/Login')
      .send({
        user_name: 'john',
        password: 'invalid_password',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(401)
    expect(response.body.statusCode).toEqual(401)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('Invalid user Credentials')
  })
})

describe('GET /Auth/Logout', () => {
  it('Logout User', async () => {
    const response = await request(app)
      .get('/Auth/Logout')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('Users logged out successfully')
    expect(response.header).toHaveProperty('set-cookie')
    expect(response.header['set-cookie'][0]).toContain('accessToken=;')
  })
})
