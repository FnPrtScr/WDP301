'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Campus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User}) {
            this.hasMany(User, {
                foreignKey: 'campus_id',
            });
        }
    }

    Campus.init(
        {
            campus_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                // not verification
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'Campus',
            freezeTableName: true,
            timestamps: true,
            // createdAt: 'created_date',
            // updatedAt: 'updated_date',
        }
    );
    return Campus;
};
