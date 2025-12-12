// models/Course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  moduleCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  studentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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

module.exports = Course;
