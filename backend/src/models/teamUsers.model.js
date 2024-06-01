'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class TeamUser extends Model {
        static associate({ User, Team,UserClassSemester }) {
            this.belongsTo(Team, { foreignKey: 'team_id' });
            this.belongsTo(User, { foreignKey: 'student_id' });

        }
    }

    TeamUser.init(
        {
            teamuser_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            team_id: {
                type: DataTypes.INTEGER,
            },
            isLead:{
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            student_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                  },
            },
            class_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Class',
                    key: 'class_id',
                  },
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'TeamUser',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho name, class_id
                {
                    unique: true,
                    fields: ['team_id','isLead','student_id','class_id'],
                },
            ]
        }
    );

    return TeamUser;
};
