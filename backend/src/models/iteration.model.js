'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Iteration extends Model {
        static associate({ User, UserClassSemester, LOCEvaluation, IterationSetting,PointResit, FinalEvaluation, TeamIterationDocument, TeamEvaluation,Point}) {
            this.hasMany(LOCEvaluation, { foreignKey: 'iteration_id' });
            this.hasMany(TeamEvaluation, { foreignKey: 'iteration_id' });
            this.hasMany(Point, { foreignKey: 'iteration_id' });
            this.hasMany(PointResit, { foreignKey: 'iteration_id' });
            this.hasMany(FinalEvaluation, { foreignKey: 'iteration_id' });
            this.hasMany(TeamIterationDocument, { foreignKey: 'iteration_id' });
            this.hasOne(IterationSetting, { foreignKey: 'iteration_id' });
            this.belongsTo(User, { foreignKey: 'owner_id' });
        }
    }

    Iteration.init(
        {
            iteration_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
            },
            milestone_id: {
                type: DataTypes.INTEGER,
            },
            startDate: {
                type: DataTypes.DATE
            },
            endDate: {
                type: DataTypes.DATE
            },
            class_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Class',
                    key: 'class_id',
                },
            },
            owner_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Iteration',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Iteration;
};
