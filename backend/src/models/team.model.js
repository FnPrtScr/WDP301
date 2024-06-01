'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Team extends Model {
        static associate({ User, Class, TeamUser, Project, Point,PointResit, UserClassSemester, TeamProject, FinalEvaluation, LOCEvaluation, TeamEvaluation, TeamIterationDocument }) {
            this.belongsTo(Class, { foreignKey: 'class_id' });
            this.belongsTo(User, { foreignKey: 'owner_id' });
            this.hasMany(TeamUser, { foreignKey: 'team_id' });
            this.hasOne(TeamProject, { foreignKey: 'team_id' });
            this.hasMany(FinalEvaluation, { foreignKey: 'team_id' });
            this.hasMany(LOCEvaluation, { foreignKey: 'team_id' });
            this.hasMany(TeamEvaluation, { foreignKey: 'team_id' });
            this.hasMany(Point, { foreignKey: 'team_id' });
            this.hasMany(PointResit, { foreignKey: 'team_id' });
            this.hasOne(TeamIterationDocument, { foreignKey: 'team_id' });
            this.hasMany(Project, { foreignKey: 'team_id' });

        }
        static async deleteRelatedData(teamId) {
            await Promise.all([
                TeamUser.destroy({ where: { team_id: teamId } }),
                TeamProject.destroy({ where: { team_id: teamId } }),
                FinalEvaluation.destroy({ where: { team_id: teamId } }),
                LOCEvaluation.destroy({ where: { team_id: teamId } }),
                Point.destroy({ where: { team_id: teamId } }),
                TeamEvaluation.destroy({ where: { team_id: teamId } }),
                TeamIterationDocument.destroy({ where: { team_id: teamId } })
            ]);
        }
    }

    Team.init(
        {
            team_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            class_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Class',
                    key: 'class_id',
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.STRING,
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
            modelName: 'Team',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['name', 'class_id'],
                },
            ],
            hooks: {
                // Hook được gọi trước khi xóa một team
                async beforeDestroy(team, options) {
                    // Xóa dữ liệu liên quan
                    await Team.deleteRelatedData(team.team_id);
                },
            },
        }
    );

    return Team;
};
