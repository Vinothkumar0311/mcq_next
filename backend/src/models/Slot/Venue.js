// // models/Venue.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// const Venue = sequelize.define('SlotVenue', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   block: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   maxSeats: {
//     type: DataTypes.INTEGER,
//     defaultValue: 30
//   },
//   ipRange: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// });

// module.exports = SlotVenue;

// models/Slot/Venue.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SlotVenue = sequelize.define('SlotVenue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  block: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  ipRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: true
});

module.exports = SlotVenue;
