'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class IterationSetting extends Model {
        static associate({ User, UserClassSemester, Iteration }) {
            // this.hasMany(UserClassesSemesters, { foreignKey: 'class_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });
            this.belongsTo(Iteration, { foreignKey: 'iteration_id' });
        }
    }

    IterationSetting.init(
        {
            iterationsetting_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            iteration_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Iteration',
                    key: 'iteration_id',
                },
            },
            sourceanddemo: {
                type: DataTypes.INTEGER,
                defaultValue: 10
            },
            document: {
                type: DataTypes.INTEGER,
                defaultValue: 20
            },
            product: {
                type: DataTypes.INTEGER,
                defaultValue: 70
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'IterationSetting',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho  iteration_id
                {
                    unique: true,
                    fields: ['iteration_id'],
                },
            ]
        }
    );

    return IterationSetting;
};
