'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class UserClassSemester extends Model {
    static associate({ User, Class, Semester}) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.belongsTo(Class, { foreignKey: 'class_id' });
      this.belongsTo(Semester, { foreignKey: 'semester_id' });
    }
  }

  UserClassSemester.init(
    {
      userClassSemester_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      class_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Class',
          key: 'class_id',
        },
      },
      semester_id:{
        type: DataTypes.INTEGER,
        references: {
          model: 'Semester',
          key: 'semester_id',
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'UserClassSemester',
      freezeTableName: true,
      timestamps: true,
      indexes: [
        // ràng buộc duy nhất cho user_id, class_id và semester_id
        {
            unique: true,
            fields: ['user_id', 'class_id','semester_id'],
        },
    ],
    }
  );

  return UserClassSemester;
};
