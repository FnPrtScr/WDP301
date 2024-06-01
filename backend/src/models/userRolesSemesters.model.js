'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class UserRoleSemester extends Model {
        
        static associate({ User, Semester, Role }) {
            this.belongsTo(User, { foreignKey: 'user_id' });
            this.belongsTo(Semester, { foreignKey: 'semester_id' });
            this.belongsTo(Role, { foreignKey: 'role_id' });
          }
    }

    UserRoleSemester.init(
        {
            userRoleSemester_id: {
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
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Role',
                    key: 'role_id',
                },
                allowNull: false,
            },
            semester_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
                allowNull: false,
            },
            status:{
                type:DataTypes.BOOLEAN,
                defaultValue:true
            }
        },
        {
            sequelize,
            modelName: 'UserRoleSemester',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return UserRoleSemester;
};
