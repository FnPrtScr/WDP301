'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Role extends Model {
        static associate({ User, UserRoleSemester }) {
            this.hasMany(UserRoleSemester,{foreignKey: 'role_id'});
        }
    }

    Role.init(
        {
            role_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Role',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return Role;
};
