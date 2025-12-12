const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MCQQuestion = sequelize.define('MCQQuestion', {
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
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optionA: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optionB: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optionC: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optionD: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  correct: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  freezeTableName: true
});

module.exports = MCQQuestion;