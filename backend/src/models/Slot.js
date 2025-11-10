module.exports = (sequelize, DataTypes) => {
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
        model: 'venues',
        key: 'id'
      }
    },
    slotFor: {
      type: DataTypes.ENUM('Internal', 'External'),
      allowNull: false,
      defaultValue: 'Internal'
    },
    residence: {
      type: DataTypes.ENUM('Hosteller', 'Day Scholar'),
      allowNull: false,
      defaultValue: 'Hosteller'
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'All'),
      allowNull: false,
      defaultValue: 'All'
    },
    allowBooking: {
      type: DataTypes.ENUM('Yes', 'No'),
      allowNull: false,
      defaultValue: 'Yes'
    },
    maxSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    seatsLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    },
    createdBy: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Admin'
    }
  }, {
    tableName: 'slots',
    timestamps: true,
    underscored: true
  });

  return Slot;
};