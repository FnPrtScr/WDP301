'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User, ChatGroup }) {
            this.belongsTo(ChatGroup, { foreignKey: 'chat_group_id' });
            this.belongsTo(User, { foreignKey: 'sender_id' });
        }
    }

    Message.init(
        {
            message_id: {
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
            sender_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }
        },
        {
            sequelize,
            modelName: 'Message',
            freezeTableName: true,
            timestamps: true,
        }
    );
    return Message;
};
