'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class MailService extends Model {
        static associate({ Users, UserClassesSemesters }) {
            // this.hasMany(UserClassesSemesters, { foreignKey: 'class_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });

        }
    }

    MailService.init(
        {
            mailservice_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            }, 
            subject: {
                type: DataTypes.TEXT,
            },
            service_desc: {
                type: DataTypes.TEXT,
            },
            content: {
                type: DataTypes.TEXT,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'MailService',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return MailService;
};
