module.exports = (sequelize, DataTypes) => {
  const Venue = sequelize.define('Venue', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    block: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    maxSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 1
      }
    },
    ipRange: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'venues',
    timestamps: true,
    underscored: true
  });

  return Venue;
};