// // // models/Question.js
// // const { DataTypes } = require('sequelize');
// // const sequelize = require('../../config/db');

// // const Question = sequelize.define('Question', {
// //   id: {
// //     type: DataTypes.INTEGER,
// //     primaryKey: true,
// //     autoIncrement: true
// //   },
// //   moduleId: {
// //     type: DataTypes.INTEGER,
// //     allowNull: false,
// //     references: {
// //       model: 'Module',
// //       key: 'id'
// //     }
// //   },
// //   sectionId: {
// //     type: DataTypes.INTEGER,
// //     allowNull: true,
// //     references: {
// //       model: 'TestSections',
// //       key: 'id'
// //     }
// //   },
// //   type: {
// //     type: DataTypes.ENUM('mcq', 'coding'),
// //     defaultValue: 'mcq'
// //   },
// //   question: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   title: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   description: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   option1: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   option2: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   option3: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   option4: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   correctAnswer: {
// //     type: DataTypes.STRING,
// //     allowNull: true
// //   },
// //   marks: {
// //     type: DataTypes.INTEGER,
// //     defaultValue: 1
// //   },
// //   negativeMarks: {
// //     type: DataTypes.INTEGER,
// //     defaultValue: 0
// //   },
// //   explanation: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   allowedLanguages: {
// //     type: DataTypes.JSON,
// //     allowNull: true
// //   },
// //   sampleInput: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   sampleOutput: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   hiddenTestcases: {
// //     type: DataTypes.TEXT,
// //     allowNull: true
// //   },
// //   points: {
// //     type: DataTypes.INTEGER,
// //     defaultValue: 1
// //   },
// //   timeLimitSec: {
// //     type: DataTypes.INTEGER,
// //     defaultValue: 2
// //   },
// //   memoryLimitMb: {
// //     type: DataTypes.INTEGER,
// //     defaultValue: 256
// //   },
// //   difficulty: {
// //     type: DataTypes.ENUM('easy', 'medium', 'hard'),
// //     defaultValue: 'easy'
// //   },
// //   tags: {
// //     type: DataTypes.JSON,
// //     allowNull: true
// //   },
// //   createdAt: {
// //     type: DataTypes.DATE,
// //     defaultValue: DataTypes.NOW
// //   },
// //   updatedAt: {
// //     type: DataTypes.DATE,
// //     defaultValue: DataTypes.NOW
// //   }
// // });

// // module.exports = Question;


// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// const Question = sequelize.define('Question', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   moduleId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'Module',
//       key: 'id'
//     }
//   },
//   sectionId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     references: {
//       model: 'TestSections',
//       key: 'id'
//     }
//   },
//   type: {
//     type: DataTypes.ENUM('mcq', 'coding'),
//     defaultValue: 'mcq'
//   },
//   question: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   option1: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   option2: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   option3: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   option4: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   correctAnswer: {
//     type: DataTypes.STRING,
//     allowNull: true
//   },
//   marks: {
//     type: DataTypes.INTEGER,
//     defaultValue: 1
//   },
//   negativeMarks: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0
//   },
//   explanation: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   allowedLanguages: {
//     type: DataTypes.JSON,
//     allowNull: true
//   },
//   sampleInput: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   sampleOutput: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   hiddenTestcases: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   points: {
//     type: DataTypes.INTEGER,
//     defaultValue: 1
//   },
//   timeLimitSec: {
//     type: DataTypes.INTEGER,
//     defaultValue: 2
//   },
//   memoryLimitMb: {
//     type: DataTypes.INTEGER,
//     defaultValue: 256
//   },
//   difficulty: {
//     type: DataTypes.ENUM('easy', 'medium', 'hard'),
//     defaultValue: 'easy'
//   },
//   tags: {
//     type: DataTypes.JSON,
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
// }, {
//   tableName: 'SlotQuestions',   // 👈 this is the key line
//   freezeTableName: true,        // prevents Sequelize from pluralizing it
// });

// module.exports = Question;


// src/models/Slot/Question.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SlotQuestion = sequelize.define('SlotQuestion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Module',
        key: 'id'
      }
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'SlotTestSection',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('mcq', 'coding'),
      defaultValue: 'mcq'
    },
    question: DataTypes.TEXT,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    option1: DataTypes.STRING,
    option2: DataTypes.STRING,
    option3: DataTypes.STRING,
    option4: DataTypes.STRING,
    correctAnswer: DataTypes.STRING,
    marks: { type: DataTypes.INTEGER, defaultValue: 1 },
    negativeMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
    explanation: DataTypes.TEXT,
    allowedLanguages: DataTypes.JSON,
    sampleInput: DataTypes.TEXT,
    sampleOutput: DataTypes.TEXT,
    hiddenTestcases: DataTypes.TEXT,
    points: { type: DataTypes.INTEGER, defaultValue: 1 },
    timeLimitSec: { type: DataTypes.INTEGER, defaultValue: 2 },
    memoryLimitMb: { type: DataTypes.INTEGER, defaultValue: 256 },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'easy'
    },
    tags: DataTypes.JSON,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'SlotQuestions', // ✅ use PascalCase to match others
    freezeTableName: true
  });

  return SlotQuestion;
};
