const { Op, Sequelize } = require('sequelize');
const { User, Campus, Milestone, Iteration, Class, Semester, UserClassSemester, UserRoleSemester, Notification, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
class NotficationService {

    async createNotification(data) {
        const result = await Notification.create(data);
        return result;
    }
    async createManyNotification(datas) {
        const results = await Notification.bulkCreate(datas);
        return results;
    }
    async getNotificationByUserId(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        let { status } = req.query;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            let where = this.buildQuery(semester_id, user_id, status);
            const getAllNotifications = await Notification.findAll({
                where: where,
                order: [['createdAt', 'DESC']]
            });
            return getAllNotifications;
        } catch (error) {
            throw error;
        }
    }
    buildQuery(semester_id, user_id, status) {
        let where = {
            [Op.and]: [
                {
                    user_id: user_id
                },
                {
                    semester_id: semester_id
                },
                {
                    status: false
                }
            ]

        };
        if (status) {
            where[Op.and].push({ status: status });
        }
        return where;
    }

    async updateOne(req) {
        try {

        } catch (error) {

        }
    }
    async updateMany(req) {
        try {

        } catch (error) {

        }
    }

}
module.exports = new NotficationService();