'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ReviewerClass extends Model {
        static associate({ User, Class, UserClassSemester }) {
            // this.hasMany(UserClassesSemesters, { foreignKey: 'class_id' });
            // this.belongsToMany(Users, { through: UserClassesSemesters, foreignKey: 'class_id' });
            this.belongsTo(Class, { foreignKey: 'class_id' });
            this.belongsTo(User, { foreignKey: 'reviewer_id' });

        }
    }

    ReviewerClass.init(
        {
            reviewerclasses_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            class_id: {
                type: DataTypes.INTEGER,
            },
            reviewer_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            xnd_review: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isIn: [[1, 2]]
                }
            },
            semester_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            campus_id: {
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
            modelName: 'ReviewerClass',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                // ràng buộc duy nhất cho user_id, class_id và semester_id
                {
                    unique: true,
                    fields: ['reviewer_id', 'class_id','xnd_review'],
                },
            ],
        }
    );

    return ReviewerClass;
};
