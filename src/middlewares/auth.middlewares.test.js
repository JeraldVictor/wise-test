const { generateAccessToken } = require('../controllers/auth/auth.function')
const { User } = require('../db/models')
const { newUser } = require('../controllers/user/user.function')

const request = require('supertest')
const app = require('../app')

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

describe('verifyJWT', () => {
  it('When proper JWT token is passed -> True', async () => {
    const token = await generateAccessToken({
      id: 1,
      name: 'John',
      user_name: 'john',
    })
    const response = await request(app)
      .get('/Safe')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual('Welcome')
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('User is logged in')
  })

  it('When In valid JWT token is passed -> Throw error', async () => {
    const response = await request(app)
      .get('/Safe')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(401)
    expect(response.body.statusCode).toEqual(401)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('Unauthorized request')
  })
})
