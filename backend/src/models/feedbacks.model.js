'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Feedback extends Model {
        static associate({ User, UserClassesSemester,Iteration }) {
            // this.hasMany(UserClassesSemesters, { foreignKey: 'class_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });
            this.belongsTo(User, { foreignKey: 'student_id' });
            this.belongsTo(User, { foreignKey: 'lecture_id' });

        }
    }

    Feedback.init(
        {
            feedback_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            content: {
                type: DataTypes.TEXT,
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
            lecture_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Feedback',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Feedback;
};
