const { expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../../app')
const { User, Slots } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function.js')
const { generateAccessToken } = require('../auth/auth.function.js')

let token = null

beforeAll(async () => {
  // Clears the database
  await User.destroy({
    truncate: true,
  })
  await Slots.destroy({
    truncate: true,
  })

  // Create 1 user in the database for testing
  const user = await newUser({
    name: 'john',
    user_name: 'john',
    password: 'john',
  })
  token = await generateAccessToken(user)
})

describe('GET /Report', () => {
  it('Get aggregated monthly report for all instructor when valid month is passed', async () => {
    const response = await request(app)
      .get('/Report')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .query('month=2024-02')

    const expected = expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        user_name: expect.any(String),
        'Total hours': expect.any(Number),
        slots: expect.any(Array),
      }),
    ])

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual(expected)
    expect(response.body.message).toEqual('Report Generated successfully')
    expect(response.body.success).toEqual(true)
  })

  it('when in valid month is passed', async () => {
    const response = await request(app)
      .get('/Report')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .query('month=Jan 2024')

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual(
      'Month is not valid, Month should be in YYYY-MM format'
    )
    expect(response.body.success).toEqual(false)
  })
})
