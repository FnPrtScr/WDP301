'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class FinalEvaluation extends Model {
        static associate({ User, UserClassesSemester, FunctionRequirement, Iteration, Team }) {
            // this.belongsTo(User, { foreignKey: 'reviewer_id', as: 'Reviewer' });
            this.belongsTo(User, { foreignKey: 'student_id', as: 'Student' });
            this.belongsTo(Team, { foreignKey: 'team_id' ,onDelete: 'CASCADE'});

        }
    }

    FinalEvaluation.init(
        {
            finalE_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            project_introduction: {
                type: DataTypes.FLOAT,
            },
            software_requirement: {
                type: DataTypes.FLOAT,
            },
            software_design: {
                type: DataTypes.FLOAT,
            },
            implementation: {
                type: DataTypes.FLOAT,
            },
            question_answer: {
                type: DataTypes.FLOAT,
            },
            iteration_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Iteration',
                    key: 'iteration_id',
                },
            },
            student_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            team_id: {
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
            xnd_review: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isIn: [[1, 2]]
                }
            }
        },
        {
            sequelize,
            modelName: 'FinalEvaluation',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['iteration_id', 'team_id', 'student_id','xnd_review'],
                },
            ]
        }
    );

    return FinalEvaluation;
};
