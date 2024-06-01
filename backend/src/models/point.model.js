'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Point extends Model {
        static associate({ User, UserClassesSemester,Class, FunctionRequirement, Iteration,Team }) {
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });
            this.belongsTo(User, { foreignKey: 'student_id'});
            this.belongsTo(Class, { foreignKey: 'class_id'});
            this.belongsTo(Team, { foreignKey: 'team_id'});
        }
    }

    Point.init(
        {
            point_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            point_by_LOC:{
                type: DataTypes.FLOAT,
            },
            graded_point: {
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
            team_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Team',
                    key: 'team_id',
                },
            },
            class_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Class',
                    key: 'class_id',
                },
            },
            note:{
                type:DataTypes.TEXT,
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
                defaultValue: true
            }
        },
        {
            sequelize,
            modelName: 'Point',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['student_id','class_id','team_id','iteration_id'],
                },
            ]
        }
    );

    return Point;
};
