'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Slots', 'check_out_day', {
      type: Sequelize.DATEONLY,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Slots', 'check_out_day')
  },
}
