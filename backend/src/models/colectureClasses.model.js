'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ColectureClass extends Model {
        static associate({ User, Class, UserClassSemester }) {
            // this.hasMany(UserClassesSemesters, { foreignKey: 'class_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });
            this.belongsTo(User, { foreignKey: 'colecture_id' });
            this.belongsTo(Class, { foreignKey: 'class_id' });
        }
    }

    ColectureClass.init(
        {
            colectureclass_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            class_id: {
                type: DataTypes.INTEGER,
            },
            colecture_id: {
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
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'ColectureClass',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho user_id, class_id và semester_id
                {
                    unique: true,
                    fields: ['colecture_id', 'class_id'],
                },
            ],
        }
    );

    return ColectureClass;
};
