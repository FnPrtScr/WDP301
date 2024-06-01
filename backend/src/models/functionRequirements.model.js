'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class FunctionRequirement extends Model {
        static associate({ User, UserClassesSemester, LOCEvaluation, Project }) {
            this.hasMany(LOCEvaluation, { foreignKey: 'fcrqm_id' });
            // this.belongsTo(Project, { foreignKey: 'project_id' });

        }
    }

    FunctionRequirement.init(
        {
            functionrequirement_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            project_id: {
                type: DataTypes.INTEGER,
            },
            feature: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            LOC: {
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
            },
            complexity: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'FunctionRequirement',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return FunctionRequirement;
};
