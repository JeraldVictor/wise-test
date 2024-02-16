const request = require('supertest')
const app = require('../../app')
const { User } = require('../../db/models')

beforeAll(async () => {
  // Clears the database
  await User.destroy({
    truncate: true,
  })
})

describe('GET /User', function () {
  it('List Empty list if no Users present', async () => {
    const response = await request(app)
      .get('/User')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual([])
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('Users fetched successfully')
  })

  it('List all Users', async () => {
    const response = await request(app)
      .get('/User')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(200)
    expect(response.body.statusCode).toEqual(200)
    expect(response.body.data).toEqual([])
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('Users fetched successfully')
  })
})

describe('POST /User', function () {
  it('Create User -> Return new user', async () => {
    const expected = expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      user_name: expect.any(String),
      password: expect.any(String),
    })

    const response = await request(app)
      .post('/User')
      .send({ name: 'John', user_name: 'john', password: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(201)
    expect(response.body.statusCode).toEqual(201)
    expect(response.body.data).toEqual(expected)
    expect(response.body.success).toEqual(true)
    expect(response.body.message).toEqual('Users created successfully')
  })

  it('Create User (no name params) -> Return Error', async () => {
    const response = await request(app)
      .post('/User')
      .send({ user_name: 'john', password: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('name is required')
  })

  it('Create User (no user_name params) -> Return Error', async () => {
    const response = await request(app)
      .post('/User')
      .send({ name: 'john', password: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('user_name is required')
  })

  it('Create User (no password params) -> Return Error', async () => {
    const response = await request(app)
      .post('/User')
      .send({ name: 'john', user_name: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.status).toEqual(422)
    expect(response.body.statusCode).toEqual(422)
    expect(response.body.data).toEqual(null)
    expect(response.body.success).toEqual(false)
    expect(response.body.message).toEqual('password is required')
  })
})
