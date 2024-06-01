'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Milestone extends Model {
        static associate({ User, UserClassSemester,Iteration }) {
            this.hasMany(Iteration, { foreignKey: 'milestone_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });

        }
    }

    Milestone.init(
        {
            milestone_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            }, 
            semester_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            name: {
                type: DataTypes.STRING,
            },
            maxLOC:{
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Milestone',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Milestone;
};
