'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TeamEvaluation extends Model {
        static associate({ User, UserClassesSemester, FunctionRequirement, Iteration,Team }) {
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });
            this.belongsTo(User, { foreignKey: 'lecture_id'});
            this.belongsTo(Team, { foreignKey: 'team_id'});
        }
    }

    TeamEvaluation.init(
        {
            teamEvaluation_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            grade_SCandDB:{
                type: DataTypes.FLOAT,
            },
            grade_SRS: {
                type: DataTypes.FLOAT,
            },
            grade_SDS: {
                type: DataTypes.FLOAT,
            },
            iteration_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Iteration',
                    key: 'iteration_id',
                },
            },
            team_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Team',
                    key: 'team_id',
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
            semester_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            status:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: 'TeamEvaluation',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['team_id','lecture_id','iteration_id'],
                },
            ]
        }
    );

    return TeamEvaluation;
};
