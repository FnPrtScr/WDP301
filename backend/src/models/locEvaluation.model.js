'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class LOCEvaluation extends Model {
        static associate({ User, UserClassesSemester, FunctionRequirement, Iteration,Team }) {
            this.belongsTo(FunctionRequirement, { foreignKey: 'fcrqm_id' });
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });
            this.belongsTo(User, { foreignKey: 'student_id',as: 'Student' });
            this.belongsTo(User, { foreignKey: 'lecture_id',as: 'Lecture' });
            this.belongsTo(Team, { foreignKey: 'team_id',onDelete: 'CASCADE'});
        }
    }

    LOCEvaluation.init(
        {
            locEvaluation_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            graded_LOC: {
                type: DataTypes.INTEGER,
            },
            iteration_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Iteration',
                    key: 'iteration_id',
                },
            },
            fcrqm_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'FunctionRequirement',
                    key: 'functionrequirement_id',
                },
            },
            quality:{
                type: DataTypes.STRING
            },
            student_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            team_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Team',
                    key: 'team_id',
                },
            },
            class_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Class',
                    key: 'class_id',
                },
            },
            lecture_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            note:{
                type: DataTypes.TEXT,
            },
            status:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'LOCEvaluation',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['student_id','lecture_id','fcrqm_id','iteration_id'],
                },
            ]
        }
    );

    return LOCEvaluation;
};
