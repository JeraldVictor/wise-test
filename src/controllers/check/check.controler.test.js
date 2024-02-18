const { expect } = require('@jest/globals')
const request = require('supertest')
const app = require('../../app')
const { User, Slots } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function.js')
const { generateAccessToken } = require('../auth/auth.function.js')
const { newCheckIn, newCheckOut } = require('./check.function.js')

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

describe('POST /Check/In', () => {
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

  it('When Check In time clashes -> Throw Error', async () => {
    await newCheckOut({
      user_id: 1,
      check_out_day: '18-02-2024',
      check_out_time: '10:30:00',
    })
    const response = await request(app)
      .post('/Check/In')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_in_day: '18-02-2024',
        check_in_time: '10:15:00',
      })

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual(
      'Instructor Check In is clashing with existing Slot'
    )
    expect(response.body.success).toEqual(false)
  })
})

describe('POST /Check/Out', () => {
  it('responds with json', async () => {
    await Slots.destroy({
      truncate: true,
    })

    await newCheckIn({
      user_id: 1,
      check_in_day: '19-02-2024',
      check_in_time: '10:00:00',
    })
    const response = await request(app)
      .post('/Check/Out')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_out_day: '19-02-2024',
        check_out_time: '10:30:00',
      })

    expect(response.status).toEqual(201)
    expect(response.body.statusCode).toEqual(201)
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        user_id: expect.any(Number),
        check_in_day: expect.any(String),
        check_in_time: expect.any(String),
        check_out_day: expect.any(String),
        check_out_time: expect.any(String),
      })
    )
    expect(response.body.message).toEqual('Check Out Done successfully')
    expect(response.body.success).toEqual(true)
  })

  it('Check Out when no Check in is done -> Throw Error', async () => {
    const response = await request(app)
      .post('/Check/Out')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_out_day: '19-02-2024',
        check_out_time: '10:31:00',
      })

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual(
      'Instructor has no active slot, please Check In'
    )
    expect(response.body.success).toEqual(false)
  })

  it('When Check Out time clashes -> Throw Error', async () => {
    await newCheckIn({
      user_id: 1,
      check_in_day: '19-02-2024',
      check_in_time: '10:31:00',
    })

    const response = await request(app)
      .post('/Check/Out')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', token)
      .send({
        check_out_day: '19-02-2024',
        check_out_time: '10:10:00',
      })

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.message).toEqual(
      'Instructor Check Out is clashing with existing Slot'
    )
    expect(response.body.success).toEqual(false)
  })
})
