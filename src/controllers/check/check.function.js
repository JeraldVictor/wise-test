const { Slots } = require('../../db/models')
const { ApiError } = require('../../utils/ApiError')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
const { Op } = require('sequelize')

const dayTime = (day = null, time = null) => {
  if (day && time) {
    return dayjs(
      `${dayjs(day, 'DD-MM-YYYY').format('DD-MM-YYYY')} ${dayjs(
        time,
        'H:mm:ss'
      ).format('H:mm:ss')}`,
      'DD-MM-YYYY H:mm:ss'
    )
  } else if (day) {
    return dayjs(day, 'DD-MM-YYYY')
  } else {
    return dayjs(time, 'H:mm:ss')
  }
}

module.exports.hasOpenSlot = async ({ user_id }) => {
  if (!user_id) {
    throw new ApiError(422, 'user_id is Requried')
  }
  const slot = await Slots.findOne({
    where: {
      user_id,
      check_out_time: null,
    },
  })
  return slot
}

module.exports.isSlotClashing = async (user_id, check_day, check_time) => {
  const slots = await Slots.findAll({
    where: {
      user_id,
      check_out_day: { [Op.not]: null },
      check_in_day: { [Op.not]: null },
      [Op.or]: {
        check_out_day: dayTime(check_day).format('YYYY-MM-DD'),
        check_in_day: dayTime(check_day).format('YYYY-MM-DD'),
      },
    },
  })

  if (slots.length >= 1) {
    const dateToCheck = dayTime(check_day, check_time)

    for (const slot of slots) {
      const startDate = dayjs(new Date(slot.check_in))
      const endDate = dayjs(new Date(slot.check_out))

      return dateToCheck.isBetween(startDate, endDate, 'milliseconds', '[]')
    }
  }

  return false
}

module.exports.newCheckIn = async ({
  user_id,
  check_in_day,
  check_in_time,
}) => {
  // Validations
  if (!user_id) {
    throw new ApiError(422, 'user_id is Requried')
  }

  if (!check_in_day || !dayjs(check_in_day, 'DD-MM-YYYY').isValid()) {
    throw new ApiError(422, 'Check In Date is not Valid')
  }

  if (
    !check_in_time ||
    !dayjs()
      .hour(dayjs(check_in_time, 'H:mm:ss').hour())
      .minute(dayjs(check_in_time, 'H:mm:ss').minute())
      .second(dayjs(check_in_time, 'H:mm:ss').second())
      .isValid()
  ) {
    throw new ApiError(422, 'Check In Time is not Valid')
  }

  // Check for Active Slot
  if (await this.hasOpenSlot({ user_id })) {
    throw new ApiError(422, 'Instructor has a active slot, please Check Out')
  }

  // Check for Slot Clash
  if (await this.isSlotClashing(user_id, check_in_day, check_in_time)) {
    throw new ApiError(
      422,
      'Instructor Check In is clashing with existing Slot'
    )
  }
  return await Slots.create({
    user_id,
    check_in_day: dayjs(check_in_day, 'DD-MM-YYYY'),
    check_in_time: dayjs(check_in_time, 'H:mm:ss'),
  })
}

module.exports.newCheckOut = async ({
  user_id,
  check_out_time,
  check_out_day,
}) => {
  // Validations
  if (!user_id) {
    throw new ApiError(422, 'user_id is Requried')
  }

  if (!check_out_day || !dayjs(check_out_day, 'DD-MM-YYYY').isValid()) {
    throw new ApiError(422, 'Check Out Date is not Valid')
  }

  if (
    !check_out_time ||
    !dayjs()
      .hour(dayjs(check_out_time, 'H:mm:ss').hour())
      .minute(dayjs(check_out_time, 'H:mm:ss').minute())
      .second(dayjs(check_out_time, 'H:mm:ss').second())
      .isValid()
  ) {
    throw new ApiError(422, 'Check Out Time is not Valid')
  }

  // Check for Active Slot
  const slot = await this.hasOpenSlot({ user_id })
  if (!slot) {
    throw new ApiError(422, 'Instructor has no active slot, please Check In')
  }

  // Check for Slot Clash
  if (await this.isSlotClashing(user_id, check_out_day, check_out_time)) {
    throw new ApiError(
      422,
      'Instructor Check Out is clashing with existing Slot'
    )
  }

  const check_out = dayjs(
    `${dayjs(check_out_day, 'DD-MM-YYYY').format(
      'YYYY-MM-DD'
    )} ${check_out_time}`
  )
  const check_in = dayjs(new Date(slot.check_in))

  // Date should be after the Check In Time
  if (check_out.diff(check_in) <= 0) {
    throw new ApiError(
      422,
      'Check out Should be after the Check In Date and Time.'
    )
  }

  await Slots.update(
    {
      check_out_day: dayjs(check_out_day, 'DD-MM-YYYY'),
      check_out_time: dayjs(check_out_time, 'H:mm:ss'),

      hours: Number(check_out.diff(check_in, 'hour', true)).toFixed(2),
    },
    {
      where: {
        id: slot.id,
      },
    }
  )

  return await Slots.findOne({ where: { id: slot.id } })
}
