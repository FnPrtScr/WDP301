'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Class extends Model {
        static associate({ User, Team, Project, UserClassSemester, TeamUser, Point, PointResit, ColectureClass, ImportHistory, ReviewerClass, Iteration, FinalEvaluation, LOCEvaluation, TeamProject }) {
            this.hasMany(UserClassSemester, { foreignKey: 'class_id' });
            this.hasMany(ColectureClass, { foreignKey: 'class_id' });
            this.hasMany(ReviewerClass, { foreignKey: 'class_id' });
            this.hasMany(TeamUser, { foreignKey: 'class_id' });
            this.hasMany(Point, { foreignKey: 'class_id' });
            this.hasMany(PointResit, { foreignKey: 'class_id' });
            this.hasMany(Team, { foreignKey: 'class_id' });
            this.hasMany(ImportHistory, { foreignKey: 'class_id' });
            this.hasMany(Iteration, { foreignKey: 'class_id' });
            this.hasMany(FinalEvaluation, { foreignKey: 'class_id' });
            this.hasMany(LOCEvaluation, { foreignKey: 'class_id' });
            this.hasMany(TeamProject, { foreignKey: 'class_id' });
            this.belongsTo(User, { foreignKey: 'user_id', as: 'Lecture' });
            this.belongsTo(User, { foreignKey: 'owner_id', as: 'Owner' });

        }
        static async deleteRelatedData(classId) {
            await Promise.all([
                UserClassSemester.destroy({ where: { class_id: classId } }),
                ColectureClass.destroy({ where: { class_id: classId } }),
                ReviewerClass.destroy({ where: { class_id: classId } }),
                TeamUser.destroy({ where: { class_id: classId } }),
                Team.destroy({ where: { class_id: classId } }),
                ImportHistory.destroy({ where: { class_id: classId } }),
            ]);
        }
    }

    Class.init(
        {
            class_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            campus_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Campus',
                    key: 'campus_id',
                },
            },
            semester_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Semester',
                    key: 'semester_id',
                },
            },
            quantity: {
                type: DataTypes.STRING,
            },
            owner_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'User',
                    key: 'user_id',
                },
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Class',
            freezeTableName: true,
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['user_id', 'name', 'campus_id', 'semester_id'],
                }
            ],
            hooks: {
                // Hook được gọi trước khi xóa một team
                async beforeDestroy(classes, options) {
                    // Xóa dữ liệu liên quan
                    await Class.deleteRelatedData(classes.class_id);
                },
            },
        }
    );

    return Class;
};
