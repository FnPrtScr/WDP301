'use strict';
const { Model, DataTypes } = require('sequelize');
const { Op, Sequelize } = require('sequelize');
module.exports = (sequelize) => {
    class User extends Model {
        static associate({
            Campus,
            Class,
            TeamUser,
            Notification,
            Point,
            PointResit,
            UserRoleSemester,
            UserClassSemester,
            ColectureClass,
            ReviewerClass,
            Feedback,
            FinalEvaluation,
            LOCEvaluation,
            TeamEvaluation,
            TeamProject,
            Project,
            Team,
            Iteration,Message,ChatGroup }) {
            this.hasMany(ColectureClass, { foreignKey: 'colecture_id' });
            this.hasMany(Feedback, { foreignKey: 'student_id' });
            this.hasMany(FinalEvaluation, { foreignKey: 'student_id' });
            this.hasMany(LOCEvaluation, { foreignKey: 'student_id' });
            this.hasMany(Notification, { foreignKey: 'user_id' });
            this.hasMany(UserClassSemester, { foreignKey: 'user_id' });
            this.hasMany(Point, { foreignKey: 'student_id' });
            this.hasMany(PointResit, { foreignKey: 'student_id' });
            this.hasMany(Iteration, { foreignKey: 'owner_id' });
            this.hasMany(ReviewerClass, { foreignKey: 'reviewer_id' });
            this.hasMany(TeamEvaluation, { foreignKey: 'lecture_id' });
            this.hasMany(TeamProject, { foreignKey: 'assigner_id' });
            this.hasMany(TeamUser, { foreignKey: 'student_id' });
            this.hasMany(Class, { foreignKey: 'user_id' });
            this.hasMany(UserRoleSemester, { foreignKey: 'user_id' });
            this.hasMany(Project, { foreignKey: 'owner_id' });
            this.hasMany(Team, { foreignKey: 'owner_id' });
            this.belongsTo(Campus, { foreignKey: 'campus_id' });
            this.hasMany(Message, { foreignKey: 'sender_id' });
            this.hasMany(ChatGroup, { foreignKey: 'lecturer_id' });
        }
        static async deleteRelatedData(userId) {
            await Promise.all([
                Class.destroy({ where: { 
                    [Op.or]:{
                        user_id: userId,
                        owner_id: userId
                    }
                 } }),
                ColectureClass.destroy({ where: { colecture_id: userId } }),
                Feedback.destroy({ where: { student_id: userId } }),
                FinalEvaluation.destroy({ where: { student_id: userId } }),
                LOCEvaluation.destroy({ where: { student_id: userId } }),
                Notification.destroy({ where: { user_id: userId } }),
                UserClassSemester.destroy({ where: { user_id: userId } }),
                Point.destroy({ where: { owner_id: userId } }),
                Iteration.destroy({ where: { owner_id: userId } }),
                ReviewerClass.destroy({ where: { reviewer_id: userId } }),
                TeamEvaluation.destroy({ where: { lecture_id: userId } }),
                TeamProject.destroy({ where: { assigner_id: userId } }),
                TeamUser.destroy({ where: { student_id: userId } }),
                UserRoleSemester.destroy({ where: { user_id: userId } }),
                Project.destroy({ where: { owner_id: userId } }),
                Team.destroy({ where: { owner_id: userId } }),
            ]);
        }
    }

    User.init(
        {
            user_id: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            google_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                    notNull: true,
                },
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            campus_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notNull: true,
                },
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                defaultValue: '%admin@123$%',
                validate: {
                    notNull: true,
                },
                allowNull: false,
            },
            avatar: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                // not verification
                defaultValue: true,
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'User',
            freezeTableName: true,
            timestamps: true,
            hooks: {
                // Hook được gọi trước khi xóa một team
                async beforeDestroy(user, options) {
                    // Xóa dữ liệu liên quan
                    await User.deleteRelatedData(user.user_id);
                },
            },
        }
    );

    return User;
};
