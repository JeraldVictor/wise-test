'use strict'

const dayjs = require('dayjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Slots',
      [
        // User 1
        {
          user_id: 1,
          check_in_day: '2024-02-18',
          check_in_time: dayjs(`2024-02-18 10:00:00`).toDate(),
          check_out_day: '2024-02-18',
          check_out_time: dayjs(`2024-02-18 10:30:00`).toDate(),
          hours: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          check_in_day: '2024-02-18',
          check_in_time: dayjs(`2024-02-18 10:31:00`).toDate(),
          check_out_day: '2024-02-18',
          check_out_time: dayjs(`2024-02-18 11:30:00`).toDate(),
          hours: 0.98,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // User 2
        {
          user_id: 2,
          check_in_day: '2024-02-18',
          check_in_time: dayjs(`2024-02-18 10:00:00`).toDate(),
          check_out_day: '2024-02-18',
          check_out_time: dayjs(`2024-02-18 10:20:00`).toDate(),
          hours: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          check_in_day: '2024-02-19',
          check_in_time: dayjs(`2024-02-19 10:30:00`).toDate(),
          check_out_day: '2024-02-19',
          check_out_time: dayjs(`2024-02-19 11:30:00`).toDate(),
          hours: 1.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Slots', null, {})
  },
}
