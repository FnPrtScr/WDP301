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
            this.belongsTo(Class, {
                foreignKey: 'class_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            this.belongsTo(User, {
                foreignKey: 'lecturer_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
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
            name:{
                type: DataTypes.STRING,
            },
            lecturer_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            semester_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            campus_id:{
                type: DataTypes.INTEGER,
                references: {
                    model: 'Campus',
                    key: 'campus_id',
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
