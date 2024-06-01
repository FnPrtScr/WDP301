'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Notification extends Model {
        static associate({ User, UserClassSemester }) {

        }
    }

    Notification.init(
        {
            notification_id: {
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
            content: {
                type: DataTypes.TEXT,
            },
            semester_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            campus_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Campus',
                    key: 'campus_id',
                },
            },
            status:{
                type: DataTypes.BOOLEAN,
                defaultValue:false
            }
        },
        {
            sequelize,
            modelName: 'Notification',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Notification;
};
