// models/Module.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Course', // ✅ fixed
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mcqPassCriteria: {
    type: DataTypes.INTEGER,
    defaultValue: 90
  },
  codingPassCriteria: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  questionsToDisplay: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  randomizeQuestions: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  testId: {
    type: DataTypes.INTEGER,
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

module.exports = Module;
