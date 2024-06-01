'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Semester extends Model {
        static associate({ User, UserClassSemester,UserRoleSemester,Milestone }) {
            this.hasMany(UserClassSemester, { foreignKey: 'semester_id' });
            this.hasMany(UserRoleSemester, { foreignKey: 'semester_id' });
            this.hasMany(Milestone, { foreignKey: 'semester_id' });
        }
    }

    Semester.init(
        {
            semester_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            startDate:{
                type: DataTypes.DATE
            },
            endDate:{
                type: DataTypes.DATE
            },
            campus_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Campus',
                    key: 'campus_id',
                },
            },
            status: {
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Semester',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Semester;
};
