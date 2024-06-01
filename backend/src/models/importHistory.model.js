'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ImportHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User }) {
        }
    }

    ImportHistory.init(
        {
            import_his_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            type_import: {
                type: DataTypes.ENUM('classes', 'lecturer', 'student'),
                defaultValue: null
            },
            class_id: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                references: {
                    model: 'Class',
                    key: 'class_id',
                },
            },
            path_file_original: {
                type: DataTypes.TEXT,
            },
            path_file_successed: {
                type: DataTypes.TEXT,
            },
            path_file_failed: {
                type: DataTypes.TEXT,
            },
            owner_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            semester_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            status: {
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'ImportHistory',
            freezeTableName: true,
            timestamps: true,
        }
    );
    return ImportHistory;
};
