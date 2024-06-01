'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Setting extends Model {
        static associate({Campus, Semester}) {
            this.belongsTo(Campus, { foreignKey: 'campus_id' });
            this.belongsTo(Semester, { foreignKey: 'semester_id' });
        }
    }

    Setting.init(
        {
            setting_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            campus_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Campus',
                    key: 'campus_id',
                },
            },
            semester_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key:'semester_id',
                },
                allowNull: false,
            },
            assessment_1: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            assessment_2: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            assessment_3: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            final_project: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            status: {
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Setting',
            freezeTableName: true,
            timestamps: true,
        }
    );
    return Setting;
};
