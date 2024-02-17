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

describe('GET /Check/In', function () {
  it('responds with json', async () => {
    const response = await request(app)
      .post('/Check/In')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_in_day: '18-02-2024',
        check_in_time: '10:00:00',
      })

    expect(response.status).toEqual(201)
    expect(response.body.statusCode).toEqual(201)
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        user_id: expect.any(Number),
        check_in_day: expect.any(String),
        check_in_time: expect.any(String),
      })
    )
    expect(response.body.message).toEqual('Check In Done successfully')
    expect(response.body.success).toEqual(true)
  })

  it('When Check In Again without Closing the Slot -> Throw Error', async () => {
    const response = await request(app)
      .post('/Check/In')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_in_day: '18-02-2024',
        check_in_time: '11:10:00',
      })

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual(
      'Instructor has a active slot, please Check Out'
    )
    expect(response.body.success).toEqual(false)
  })
})
