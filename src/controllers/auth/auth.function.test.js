const { expect } = require('@jest/globals')
const {
  checkLogin,
  generateAccessToken,
  validateAccessToken,
} = require('./auth.function')

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

describe('checkLogin (Check User Login)', () => {
  it('with valid user credentials -> user data', async () => {
    const expected = expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      user_name: expect.any(String),
      password: expect.any(String),
    })
    const actual = await checkLogin({
      user_name: 'john',
      password: 'john',
    })

    expect(actual).toEqual(expected)
  })

  it('with in-valid user credentials -> throw error', async () => {
    try {
      const actual = await checkLogin({
        user_name: 'john',
        password: 'invalid_password',
      })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Invalid user Credentials')
    }
  })

  it('user_name not passed -> throw error', async () => {
    try {
      const actual = await checkLogin({
        password: 'password',
      })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_name is required')
    }
  })

  it('password not passed -> throw error', async () => {
    try {
      const actual = await checkLogin({
        user_name: 'john',
      })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'password is required')
    }
  })
})

describe('generateAccessToken (Generate Access Token)', () => {
  it('Generate Access Token (valid user is passed) -> return jwt token', async () => {
    const expected = expect.any(String)

    const user = await checkLogin({
      user_name: 'john',
      password: 'john',
    })

    const actual = await generateAccessToken(user)

    expect(actual).toEqual(expected)
  })

  it('user_name not present -> throw error', async () => {
    try {
      const actual = await generateAccessToken({ id: 1, name: 'John' })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_name is required')
    }
  })

  it('id not present -> throw error', async () => {
    try {
      const actual = await generateAccessToken({
        name: 'John',
        user_name: 'john',
      })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'id is required')
    }
  })

  it('name not present -> throw error', async () => {
    try {
      const actual = await generateAccessToken({
        id: 1,
        user_name: 'john',
      })

      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'name is required')
    }
  })
})

describe('validateAccessToken (Validate Access Token)', () => {
  it('When JWT is valid -> return user', async () => {
    const expected = expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      user_name: expect.any(String),
      password: expect.any(String),
    })

    const user = await checkLogin({
      user_name: 'john',
      password: 'john',
    })

    const token = await generateAccessToken(user)
    const actual = await validateAccessToken(token)

    expect(actual).toEqual(expected)
  })

  it('When JWT is invalid -> throw error', async () => {
    try {
      const token = await generateAccessToken({
        id: 333,
        name: 'john',
        user_name: 'john',
      })

      const actual = await validateAccessToken(token)
      expect(actual).toThrow(/Invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Invalid access token')
    }
  })
})
