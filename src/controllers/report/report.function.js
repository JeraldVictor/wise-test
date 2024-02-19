const { Slots, User, sequelize } = require('../../db/models')
const { ApiError } = require('../../utils/ApiError')
const { asyncForEach } = require('../../utils')
const dayjs = require('dayjs')
const { Op } = require('sequelize')

const validateDate = (monthDate) => {
  var date_regex = /^\d{4}-\d{2}$/
  return date_regex.test(monthDate)
}

module.exports.getUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'user_name'],
  })

  return users
}

module.exports.getTotalHrsForUser = async (user_id, { startDate, endDate }) => {
  const total_hrs = await Slots.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('hours')), 'hours']],
    where: {
      user_id,
      check_out_day: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
      check_in_day: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  })

  return total_hrs[0]?.hours ? Number(total_hrs[0].hours).toFixed(2) : 0
}

module.exports.getReport = async ({ month }) => {
  const users = await this.getUsers()
  if (!validateDate(month)) {
    throw new ApiError(
      422,
      'Month is not valid, Month should be in YYYY-MM format'
    )
  }

  const date = dayjs(`${month}-00`, 'YYYY-MM-DD')

  const dateRange = {
    startDate: date.startOf('month').format('YYYY-MM-DD'),
    endDate: date.endOf('month').format('YYYY-MM-DD'),
  }

  let results = []
  await asyncForEach(users, async (user) => {
    const slots = await Slots.findAll({
      where: {
        user_id: user.id,
        check_out_day: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
        check_in_day: {
          [Op.gte]: dateRange.startDate,
          [Op.lte]: dateRange.endDate,
        },
      },
    })

    results.push({
      ...user.toJSON(),
      'Total hours': await this.getTotalHrsForUser(user.id, dateRange),
      slots,
    })
  })

  return results
}
