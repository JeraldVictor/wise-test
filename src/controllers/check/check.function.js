const { Slots } = require('../../db/models')
const { ApiError } = require('../../utils/ApiError')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

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

module.exports.newCheckIn = async ({
  user_id,
  check_in_day,
  check_in_time,
}) => {
  // Validations
  if (!user_id) {
    throw new ApiError(422, 'user_id is Requried')
  }

  if (!check_in_day || !dayjs(check_in_day, 'DD-MM-YYY').isValid()) {
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

  return await Slots.create({
    user_id,
    check_in_day: dayjs(check_in_day, 'DD-MM-YYY'),
    check_in_time: dayjs(check_in_time, 'H:mm:ss'),
  })
}
