const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const CodingProblem = sequelize.define('CodingProblem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ModuleTest',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  inputFormat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  outputFormat: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  constraints: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  sampleInput: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sampleOutput: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  hiddenTests: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  freezeTableName: true
});

module.exports = CodingProblem;