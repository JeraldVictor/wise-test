const { expect } = require('@jest/globals')
const { getUsers, newUser } = require('./user.function')
const { User } = require('../../db/models')

beforeAll(async () => {
  // Clears the database
  await User.destroy({
    truncate: true,
  })
})

describe('User Model Functions', () => {
  it('getUsers -> return empty if no users are present', async () => {
    const expected = expect.arrayContaining([])
    const actual = await getUsers()

    expect(actual).toEqual(expected)
  })

  it('newUser -> Create new user and return created', async () => {
    const expected = expect.objectContaining({
      id: expect.any(Number),
      name: expect.any(String),
      user_name: expect.any(String),
      password: expect.any(String),
    })

    const actual = await newUser({
      name: 'John',
      user_name: 'johm',
      password: 'john',
    })

    expect(actual.toJSON()).toEqual(expected)
  })

  it('getUsers -> List all Users', async () => {
    const expected = expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        user_name: expect.any(String),
        password: expect.any(String),
      }),
    ])
    const actual = await getUsers()

    expect(actual).toEqual(expected)
  })

  it('newUser (with no name) -> throw error', async () => {
    try {
      const expect = await newUser({
        user_name: 'johm',
        password: 'john',
      })
      expect(expect).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'name is required')
    }
  })

  it('newUser (with no user_name) -> throw error', async () => {
    try {
      const expected = await newUser({
        name: 'johm',
        password: 'john',
      })
      expect(expected).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_name is required')
    }
  })

  it('newUser (with no password) -> throw error', async () => {
    try {
      const expect = await newUser({
        user_name: 'john',
        name: 'johm',
      })
      expect(expect).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'password is required')
    }
  })
})
