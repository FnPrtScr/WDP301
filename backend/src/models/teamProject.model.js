'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TeamProject extends Model {
        static associate({ User,Team, Class, TeamUser, Project, UserClassSemester }) {
            this.belongsTo(Team,{ foreignKey: 'team_id' });
            this.belongsTo(Project,{ foreignKey: 'project_id' });
            this.belongsTo(User, { foreignKey: 'assigner_id'});
        }
    }

    TeamProject.init(
        {
            teamproject_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
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
            project_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Project',
                    key: 'project_id',
                },
            },
            technical: {
                type: DataTypes.STRING
            },
            link_gitlab: {
                type: DataTypes.STRING,
            },
            link_jira: {
                type: DataTypes.STRING,
            },
            tokenGit:{
                type: DataTypes.TEXT,
            },
            email_owner:{
                type: DataTypes.STRING,
            },
            apiToken:{
                type: DataTypes.TEXT
            },
            project_tracking:{
                type: DataTypes.STRING,
            },
            assigner_id:{
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
            modelName: 'TeamProject',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho team_id
                {
                    unique: true,
                    fields: ['team_id'],
                },]
        }
    );

    return TeamProject;
};
