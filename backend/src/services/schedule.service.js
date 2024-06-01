const dayjs = require("dayjs");
require('dayjs/locale/vi');
const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Semester, Team, TeamUser, Iteration, Milestone, UserClassSemester, UserRoleSemester, ColectureClass, ReviewerClass, Notification, sequelize } = require('../models')
const { ErrorResponse } = require('../utils/response');
const schedule = require('node-schedule');
const { RULE } = process.env;
const PointService = require('../services/point.service')
class ScheduleService {
    constructor() {
        this.startSchedule();
    }

    async semesterSchedule() {
        try {
            const currentDate = dayjs().add(7, 'hour');
            const semesters = await Semester.findAll({
                where: { status: true },
            });

            if (semesters.length > 0) {
                await Promise.all(semesters.map(async (semester) => {
                    const endDate = dayjs(semester.endDate);
                    if (currentDate.isAfter(endDate) || currentDate.isAfter(endDate.subtract(5, 'm'))) {
                        await Semester.update({ status: false }, { where: { semester_id: semester.semester_id } })
                    }
                }));
            }
        } catch (error) {
            throw error;
        }
    }

    async iterationSchedule() {
        try {
            const currentDate = dayjs().add(7, 'hour');
            const iterations = await Iteration.findAll({
                where: {
                    status: true,
                    name: {
                        [Op.ne]: "Iteration 4"
                    }
                }
            });
            if (iterations.length > 0) {
                await Promise.all(iterations.map(async (iteration) => {
                    const endDate = dayjs(iteration.endDate);
                    if (currentDate.isAfter(endDate) || currentDate.isAfter(endDate.subtract(5, 'm'))) {
                        await PointService.gradePointAutoByTeam(iteration.iteration_id)
                        await Iteration.update({ status: false }, { where: { iteration_id: iteration.iteration_id } })
                    }
                }));
            }
        } catch (error) {
            throw error;
        }
    }

    async startSchedule() {
        schedule.scheduleJob(RULE, () => this.semesterSchedule());
        schedule.scheduleJob(RULE, () => this.iterationSchedule());
    }
}

module.exports = new ScheduleService();
