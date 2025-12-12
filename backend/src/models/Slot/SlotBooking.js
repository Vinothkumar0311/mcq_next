// models/SlotBooking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const Slot = require("./Slot");

const SlotBooking = sequelize.define(
  "SlotBooking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Slot,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      // Booked / Cancelled
      type: DataTypes.STRING,
      defaultValue: "Booked",
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = SlotBooking;
