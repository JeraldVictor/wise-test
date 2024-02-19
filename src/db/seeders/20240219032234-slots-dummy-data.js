'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Slots',
      [
        // User 1
        {
          user_id: 1,
          check_in_day: '18-02-2024',
          check_in_time: '10:00:00',
          check_out_day: '18-02-2024',
          check_out_time: '10:30:00',
          hours: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          check_in_day: '18-02-2024',
          check_in_time: '10:31:00',
          check_out_day: '18-02-2024',
          check_out_time: '11:30:00',
          hours: 0.98,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // User 2
        {
          user_id: 2,
          check_in_day: '18-02-2024',
          check_in_time: '10:00:00',
          check_out_day: '18-02-2024',
          check_out_time: '10:30:00',
          hours: 0.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          check_in_day: '19-02-2024',
          check_in_time: '10:30:00',
          check_out_day: '19-02-2024',
          check_out_time: '11:30:00',
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
