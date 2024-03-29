'use strict'
const { Model } = require('sequelize')
const dayjs = require('dayjs')

module.exports = (sequelize, DataTypes) => {
  class Slots extends Model {
    static associate(models) {
      // Slot and User relation
      Slots.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
        },
      })
      models.User.hasMany(Slots, {
        foreignKey: {
          name: 'user_id',
        },
      })
    }
  }
  Slots.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      check_in_day: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        set(value) {
          this.setDataValue('check_in_day', dayjs(value).format('YYYY-MM-DD'))
        },
        get() {
          const value = this.getDataValue('check_in_day')
          return value ? dayjs(value, 'YYYY-MM-DD').format('DD-MM-YYYY') : value
        },
      },
      check_in_time: {
        type: DataTypes.DATE,
        get() {
          const value = this.getDataValue('check_in_time')
          return value ? dayjs(value).format('H:mm:ss') : value
        },
        set(value) {
          const day = this.getDataValue('check_in_day')
          this.setDataValue(
            'check_in_time',
            dayjs(`${day} ${value.format('H:mm:ss')}`).toDate()
          )
        },
      },
      check_out_day: {
        type: DataTypes.DATEONLY,
        set(value) {
          this.setDataValue('check_out_day', dayjs(value).format('YYYY-MM-DD'))
        },
        get() {
          const value = this.getDataValue('check_in_day')
          return value ? dayjs(value, 'YYYY-MM-DD').format('DD-MM-YYYY') : value
        },
      },
      check_out_time: {
        type: DataTypes.DATE,
        get() {
          const value = this.getDataValue('check_out_time')
          return value ? dayjs(value).format('H:mm:ss') : value
        },
        set(value) {
          const day = this.getDataValue('check_out_day')
          this.setDataValue(
            'check_out_time',
            dayjs(`${day} ${value.format('H:mm:ss')}`).toDate()
          )
        },
      },
      hours: {
        type: DataTypes.FLOAT,
      },
      check_in: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.check_in_day && this.check_in_time) {
            return dayjs(
              `${this.check_in_day} ${this.check_in_time}`,
              'DD-MM-YYYY H:mm:ss'
            ).toDate()
          } else {
            return null
          }
        },
        set(value) {
          throw new Error('Do not try to set the `check_in` value!')
        },
      },
      check_out: {
        type: DataTypes.VIRTUAL,
        get() {
          if (this.check_out_day && this.check_out_time) {
            return dayjs(
              `${this.check_out_day} ${this.check_out_time}`,
              'DD-MM-YYYY H:mm:ss'
            ).toDate()
          } else {
            return null
          }
        },
        set(value) {
          throw new Error('Do not try to set the `check_out` value!')
        },
      },
    },
    {
      sequelize,
      modelName: 'Slots',
    }
  )
  return Slots
}
