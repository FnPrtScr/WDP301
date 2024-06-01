'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TeamIterationDocument extends Model {
        static associate({ User, UserClassesSemester, FunctionRequirement, Iteration,Team }) {
            this.belongsTo(Team, { foreignKey: 'team_id' });
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });

        }
    }

    TeamIterationDocument.init(
        {
            tid_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            path_file_doc: {
                type: DataTypes.STRING,
            },
            url_doc: {
                type: DataTypes.STRING,
            },
            path_file_final_present: {
                type: DataTypes.STRING,
            },
            iteration_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Iteration',
                    key: 'iteration_id',
                },
            },
            team_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Team',
                    key: 'team_id',
                },
            },
        },
        {
            sequelize,
            modelName: 'TeamIterationDocument',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['team_id','iteration_id'],
                },
            ]
        }
    );

    return TeamIterationDocument;
};
