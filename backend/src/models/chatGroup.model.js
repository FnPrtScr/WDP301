'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ChatGroup extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Class, User, Message, File }) {
            this.belongsTo(Class, { foreignKey: 'class_id' });
            this.belongsTo(User, { foreignKey: 'lecturer_id' });
            this.hasMany(Message, { foreignKey: 'chat_group_id' });
            this.hasMany(File, { foreignKey: 'chat_group_id' });
        }
    }

    ChatGroup.init(
        {
            chat_group_id: {
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
            lecturer_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            status:{
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            }
        },
        {
            sequelize,
            modelName: 'ChatGroup',
            freezeTableName: true,
            timestamps: true,
        }
    );
    return ChatGroup;
};
