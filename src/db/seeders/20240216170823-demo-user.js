'use strict'
/** @type {import('sequelize-cli').Migration} */

const { encrypt } = require('../../utils/index')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'User 1',
          user_name: 'user1',
          password: encrypt('user1'),
          updatedAt: new Date(),
          createdAt: new Date(),
        },
        {
          name: 'User 2',
          user_name: 'user2',
          password: encrypt('user2'),
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
