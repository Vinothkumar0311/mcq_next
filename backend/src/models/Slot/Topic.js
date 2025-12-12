// models/Topic.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Topic = sequelize.define(
  "SlotTopic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Module",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resourceLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Resource link must be a valid URL",
        },
      },
    },
    documentPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "SlotTopics",
    freezeTableName: true,
    // indexes: [{ fields: ["moduleId"] }, { fields: ["moduleId", "order"] }],
  }
);

module.exports = Topic;

// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define(
//     "SlotTopic",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//       },
//       moduleId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "Module",
//           key: "id"
//         }
//       },
//       title: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//       resourceLink: {
//         type: DataTypes.STRING,
//         allowNull: true,
//         validate: {
//           isUrl: {
//             msg: "Resource link must be a valid URL"
//           }
//         }
//       },
//       documentPath: {
//         type: DataTypes.STRING,
//         allowNull: true
//       },
//       order: {
//         type: DataTypes.INTEGER,
//         defaultValue: 0
//       },
//       createdAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//       },
//       updatedAt: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//       }
//     },
//     {
//       tableName: "SlotTopics",
//       freezeTableName: true,
//       indexes: [
//         { fields: ["moduleId"] },
//         { fields: ["moduleId", "order"] }
//       ]
//     }
//   );
// };
