'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class File extends Model {
        static associate({ User, ChatGroup }) {
            this.belongsTo(ChatGroup, { foreignKey: 'chat_group_id' });
            this.belongsTo(User, { foreignKey: 'uploader_id' });
        }
    }

    File.init(
        {
            file_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            chat_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'ChatGroup',
                    key: 'chat_group_id',
                },
            },
            uploader_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            file_path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'File',
            freezeTableName: true,
            timestamps: true,
        }
    );
    return File;
};
