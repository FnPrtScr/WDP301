'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Project extends Model {
        static associate({ User, Class, FunctionRequirement, UserClassSemester, TeamProject, Team }) {
            this.hasMany(FunctionRequirement, { foreignKey: 'project_id' });
            this.hasMany(TeamProject, { foreignKey: 'project_id' });
            this.belongsTo(User, { foreignKey: 'owner_id', as: 'Lecturer'});
        }
        static async deleteRelatedData(projectId) {
            await Promise.all([
                FunctionRequirement.destroy({ where: { project_id: projectId } }),
                TeamProject.destroy({ where: { project_id: projectId } })
            ]);
        }
    }

    Project.init(
        {
            project_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            file_path_requirement: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
            },
            owner_id: {
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
            semester_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            type: {
                type: DataTypes.ENUM('lecturer_created', 'student_requested'),
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Project',
            freezeTableName: true,
            timestamps: true,
            hooks: {
                // Hook được gọi trước khi xóa một team
                async beforeDestroy(project, options) {
                    // Xóa dữ liệu liên quan
                    await Project.deleteRelatedData(project.project_id);
                },
            },
        }
    );

    return Project;
};
