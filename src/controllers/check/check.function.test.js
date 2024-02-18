const { expect } = require('@jest/globals')
const { User, Slots } = require('../../db/models/index.js')
const { newUser } = require('../user/user.function.js')
const {
  newCheckIn,
  hasOpenSlot,
  newCheckOut,
  isSlotClashing,
} = require('./check.function.js')

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

describe('Check Out', () => {
  it('Create a Valid Check Out -> returns 1', async () => {
    await resetDB()

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
    const actual = await newCheckOut({
      user_id: 1,
      check_out_day: '18-02-2024',
      check_out_time: '10:30:00',
    })

    expect(actual).toEqual(expected)
  })

  it('When no Active slot to Check Out -> Throw error', async () => {
    await resetDB()
    try {
      const expected = [1]
      const actual = await newCheckOut({
        user_id: 1,
        check_out_day: '18-02-2024',
        check_out_time: '10:30:00',
      })

      expect(actual).toEqual(expected)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Instructor has no active slot, please Check In'
      )
    }
  })

  it('when invalid check_out_day is passed -> throw error', async () => {
    try {
      const actual = await newCheckOut({
        user_id: 1,
        check_out_day: 'invalid',
        check_out_time: '10:00:00',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check Out Date is not Valid')
    }
  })

  it('when not passing check_out_day -> throw error', async () => {
    try {
      const actual = await newCheckOut({
        user_id: 1,
        check_out_time: '10:00:00',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check Out Date is not Valid')
    }
  })

  it('when invalid check_out_time is passed -> throw error', async () => {
    try {
      const actual = await newCheckOut({
        user_id: 1,
        check_out_day: '18-02-2024',
        check_out_time: 'invalid',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check Out Time is not Valid')
    }
  })

  it('when not passing check_out_time -> throw error', async () => {
    try {
      const actual = await newCheckOut({
        user_id: 1,
        check_out_day: '18-02-2024',
      })
      expect(actual).toThrow(/invalid/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Check Out Time is not Valid')
    }
  })

  it('when not passing user_id -> throw error', async () => {
    try {
      const actual = await newCheckOut({
        check_out_day: '18-02-2024',
        check_out_time: '10:00:00',
      })
      expect(actual).toThrow(/required/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'user_id is Requried')
    }
  })

  it('When Check out, check_out_date and check_out_time should be after Check In Time', async () => {
    await resetDB()

    await newCheckIn({
      user_id: 1,
      check_in_day: '18-02-2024',
      check_in_time: '10:00:00',
    })
    try {
      const actual = await newCheckOut({
        user_id: 1,
        check_out_day: '17-02-2024',
        check_out_time: '10:00:00',
      })
      expect(actual).toThrow(/after the Check In/)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Check out Should be after the Check In Date and Time.'
      )
    }
  })
})

describe('isSlotClashing', () => {
  it('When there is No slot clash in Check IN Time ->  false', async () => {
    await resetDB()
    await newCheckIn({
      user_id: 1,
      check_in_day: '18-02-2024',
      check_in_time: '10:00:00',
    })
    await newCheckOut({
      user_id: 1,
      check_out_day: '18-02-2024',
      check_out_time: '10:30:00',
    })

    const expected = false
    const actual = await isSlotClashing(
      // user_id:
      1,
      // check_day:
      '18-02-2024',
      // check_time:
      '10:31:00'
    )

    expect(actual).toEqual(expected)
  })

  it('When there is slot clash in Check IN Time ->  true', async () => {
    await resetDB()
    await newCheckIn({
      user_id: 1,
      check_in_day: '18-02-2024',
      check_in_time: '10:00:00',
    })
    await newCheckOut({
      user_id: 1,
      check_out_day: '18-02-2024',
      check_out_time: '10:30:00',
    })

    const expected = true
    const actual = await isSlotClashing(
      // user_id:
      1,
      // check_day:
      '18-02-2024',
      // check_time:
      '10:05:00'
    )

    expect(actual).toEqual(expected)
  })
})
