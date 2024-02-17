const { expect } = require('@jest/globals')
const { User, Slots } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function.js')
const { newCheckIn, hasOpenSlot } = require('./check.function.js')

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

  // Create 1 user in the database for testing
  await newUser({
    name: 'john',
    user_name: 'john',
    password: 'john',
  })
  await newUser({
    name: 'User 2',
    user_name: 'user2',
    password: 'user2',
  })
})

describe('hasOpenSlot (Check for Open Slot)', () => {
  it('when existing check in is present without checkout time -> slot object', async () => {
    await newCheckIn({
      user_id: 1,
      check_in_day: '18-02-2024',
      check_in_time: '10:00:00',
    })

    const expected = expect.objectContaining({
      id: expect.any(Number),
      user_id: expect.any(Number),
      check_in_day: expect.any(String),
      check_in_time: expect.any(String),
    })
    const actual = await hasOpenSlot({ user_id: 1 })
    await resetDB()

    expect(actual).toEqual(expected)
  })

  it('when existing check in is not present without checkout time -> null', async () => {
    const expected = null
    const actual = await hasOpenSlot({ user_id: 2 })

    expect(actual).toEqual(expected)
  })

  it('when not passing user_id -> throw error', async () => {
    try {
      const actual = await hasOpenSlot({})
      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_id is Requried')
    }
  })
})

describe('Create Check In', () => {
  it('With Valid params -> returns slot object', async () => {
    const expected = expect.objectContaining({
      id: expect.any(Number),
      user_id: expect.any(Number),
      check_in_day: expect.any(String),
      check_in_time: expect.any(String),
    })
    const actual = await newCheckIn({
      user_id: 1,
      check_in_day: '18-02-2024',
      check_in_time: '10:00:00',
    })

    expect(actual).toEqual(expected)
  })

  it('when invalid check_in_day is passed -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        user_id: 1,
        check_in_day: 'invalid',
        check_in_time: '10:00:00',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check In Date is not Valid')
    }
  })

  it('when not passing check_in_day -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        user_id: 1,
        check_in_time: '10:00:00',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check In Date is not Valid')
    }
  })

  it('when invalid check_in_time is passed -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        user_id: 1,
        check_in_day: '18-02-2024',
        check_in_time: 'invalid',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check In Time is not Valid')
    }
  })

  it('when not passing check_in_time -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        user_id: 1,
        check_in_day: '18-02-2024',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check In Time is not Valid')
    }
  })

  it('when not passing user_id -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        check_in_day: '18-02-2024',
        check_in_time: '10:00:00',
      })
      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_id is Requried')
    }
  })

  it('when there is a open slot  -> throw error', async () => {
    try {
      const actual = await newCheckIn({
        user_id: 1,
        check_in_day: '18-02-2024',
        check_in_time: '10:00:00',
      })
      expect(actual).toThrow(/Check Out/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Instructor has a active slot, please Check Out'
      )
    }
  })
})
