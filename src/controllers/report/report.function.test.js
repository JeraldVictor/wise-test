const { expect } = require('@jest/globals')
const { getReport } = require('./report.function')
const { User, Slots } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function')

const resetDB = async () => {
  // Clears the database
  await User.destroy({
    truncate: true,
  })
  await Slots.destroy({
    truncate: true,
  })
}

beforeAll(async () => {
  await resetDB()

  // Create user(s) in the database for testing
  await newUser({
    name: 'john',
    user_name: 'john',
    password: 'john',
  })
})

describe('getReport', () => {
  it('return report if valid month is passed', async () => {
    const expected = expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        user_name: expect.any(String),
        'Total hours': 0,
        slots: expect.any(Array),
      }),
    ])

    const actual = await getReport({ month: '2024-02' })

    expect(actual).toEqual(expected)
  })

  it('return empty slots [], when no data is present', async () => {
    const expected = expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        user_name: expect.any(String),
        'Total hours': 0,
        slots: [],
      }),
    ])

    const actual = await getReport({ month: '2024-02' })

    expect(actual).toEqual(expected)
  })

  it('throw error when in valid month is passed', async () => {
    try {
      const actual = await getReport({ month: 'Jan 2024' })

      expect(actual).toThrow(/YYYY-MM/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Month is not valid, Month should be in YYYY-MM format'
      )
    }
  })
})
