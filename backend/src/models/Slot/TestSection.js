// models/TestSection.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TestSection = sequelize.define('SlotTestSection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  testId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SlotTest', // ✅ correct reference
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('mcq', 'coding'),
    defaultValue: 'mcq'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  marksPerQuestion: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  questionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  randomizeQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  freezeTableName: true // ✅ no pluralization
});

module.exports = TestSection;
