// // models/Slot.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// const Slot = sequelize.define('Slot', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   date: {
//     type: DataTypes.DATEONLY,
//     allowNull: false
//   },
//   startTime: {
//     type: DataTypes.TIME,
//     allowNull: false
//   },
//   endTime: {
//     type: DataTypes.TIME,
//     allowNull: false
//   },
//   venueId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Venue', // ✅ fixed
//       key: 'id'
//     }
//   },
//   slotFor: {
//     type: DataTypes.STRING,
//     defaultValue: 'Internal'
//   },
//   residence: {
//     type: DataTypes.STRING,
//     defaultValue: 'Hosteller'
//   },
//   gender: {
//     type: DataTypes.STRING,
//     defaultValue: 'All'
//   },
//   allowBooking: {
//     type: DataTypes.STRING,
//     defaultValue: 'Yes'
//   },
//   maxSeats: {
//     type: DataTypes.INTEGER,
//     defaultValue: 30
//   },
//   seatsLeft: {
//     type: DataTypes.INTEGER,
//     defaultValue: 30
//   },
//   createdBy: {
//     type: DataTypes.STRING,
//     defaultValue: 'Admin'
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW
//   }
// }, {
//   freezeTableName: true
// });

// module.exports = Slot;


const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Slot = sequelize.define('Slot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  venueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SlotVenue', // ✅ must match exactly what’s in Venue.js
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  slotFor: {
    type: DataTypes.STRING,
    defaultValue: 'Internal'
  },
  residence: {
    type: DataTypes.STRING,
    defaultValue: 'Hosteller'
  },
  gender: {
    type: DataTypes.STRING,
    defaultValue: 'All'
  },
  allowBooking: {
    type: DataTypes.STRING,
    defaultValue: 'Yes'
  },
  maxSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  seatsLeft: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  createdBy: {
    type: DataTypes.STRING,
    defaultValue: 'Admin'
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

module.exports = Slot;
