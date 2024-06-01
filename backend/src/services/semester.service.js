const { User, Campus, Role, Milestone, Iteration, Class, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const UserService = require('../services/user.service')
const importDataExcel = require('../imports/import-data-excel');
const { Op, ENUM } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const { lowerCase, uppperCase } = require('../utils/format-string')

class SemestersService {
    async getOne(req, res) {
        const { name_semester } = req.body;
        try {
            const rs = await Semester.findOne({
                where: { name: name_semester },
                attributes: ['semester_id', 'name'],
                include: [
                    {
                        model: UserClassSemester,
                        attributes: ['userClassSemester_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'last_name', 'first_name', 'code'],
                            },
                            {
                                model: Class,
                                attributes: ['name']
                            },
                        ],
                    },
                ]
            });
            return res.status(200).json(rs)
        } catch (error) {
            return res.status(400).json(error);
        }
    }
    async getDeadlineSemester(req) {
        const { campus_id, semester_id } = req.params;
        try {
            const rs = await Semester.findOne({
                where: { semester_id: semester_id, campus_id: campus_id },
            });
            return rs
        } catch (error) {
            throw error;
        }
    }

    async checkEmailInDB(email) {
        try {
            const user = await User.findOne({ where: { email: email, status: true } });
            return user || false;
        } catch (error) {
            return error;
        }
    }

    async createOne(req, res) {
        const { campus_id } = req.params;
        const { name_semester, startDate, endDate, status } = req.body;
        let arrDataIteration = [];
        try {
            const findSemester = await Semester.findOne({ where: { name: uppperCase(name_semester) } });
            if (findSemester) return res.status(400).send("Semester already exists!");
            const createOne = await Semester.create({ name: uppperCase(name_semester), startDate: startDate, endDate: endDate, campus_id: campus_id, status: status });
            if (!createOne) return res.status(500).send('Create Semester failed');
            const createOneUserRoleSemester = await UserRoleSemester.create({
                user_id: req.user.id,
                role_id: 1,
                semester_id: createOne.semester_id,
            })
            if (!createOneUserRoleSemester) return res.status(500).send("Create UserRoleSemester failed!")
            const createMilestoneObject = (index) => {
                let maxLOC;
                switch (index) {
                    case 1:
                    case 2:
                        maxLOC = 240;
                        break;
                    case 3:
                        maxLOC = 720;
                        break;
                    default:
                        maxLOC = 0;
                        break;
                }
                return {
                    name: `Iteration ${index}`,
                    semester_id: createOne.semester_id,
                    maxLOC
                };
            };
            for (let index = 1; index < 5; index++) {
                const milestone = createMilestoneObject(index);
                arrDataIteration.push(milestone);
            }
            const createMilestone = await Milestone.bulkCreate(arrDataIteration);
            if (!createMilestone) return res.status(500).send("Create Milestone failed");
            return res.status(200).send("Create Semester Successfull!");
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getAll(req, res) {
        const { campus_id } = req.params;
        try {
            let { keyword, year, page, limit } = req.query;

            let where = this.buildQuery(campus_id, uppperCase(keyword), year);

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            const getAll = await Semester.findAndCountAll({
                where: where,
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });
            const currentPageCount = getAll.count;
            return res.status(200).json({
                success: true,
                data: getAll,
                totalPages: Math.ceil(getAll.count / limit),
                currentPageCount: currentPageCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    buildQuery(campus_id, keyword, year) {
        let where = {
            campus_id: campus_id
        };
        if (keyword) {
            where.name = { [Op.like]: `%${keyword}%` };
        }
        if (year) {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
            where.startDate = { [Op.between]: [startDate, endDate] };
        }
        return where;
    }


    async updateOne(req, res) {
        const { semester_id } = req.params;
        const { name_semester, startDate, endDate, status } = req.body;
        try {
            const findSemester = await Semester.findOne({ where: { semester_id: semester_id } });
            if (!findSemester) return res.status(400).send("Semester does not exist!");
            const checkExistSemester = await Semester.findOne({ where: { name: uppperCase(name_semester), semester_id: { [Op.ne]: +semester_id }, status: true } });
            if (checkExistSemester) return res.status(400).send("Semester already exists");
            await Semester.update({ name: uppperCase(name_semester), startDate: startDate, endDate: endDate, status: status }, { where: { semester_id: semester_id } });
            return res.status(200).send("Semester updated successfully!");
        } catch (error) {
            console.error("Error updating semester:", error);
            return res.status(500).send("Internal Server Error");
        }
    }

    async deleteOne(req, res) {
        const { semester_id } = req.params;
        try {
            const findSemester = await Semester.findOne({ where: { semester_id: semester_id } });
            if (!findSemester) return res.status(400).send("Semester does not exist!");
            const result = await Semester.destroy({ where: { semester_id: semester_id } });
            if (!result) return res.status(400).send("This semester already has data and cannot be deleted")
            return res.status(200).send("Semester deleted successfully!");
        } catch (error) {
            return res.status(500).send("This semester already has data and cannot be deleted");
        }
    }
    async changeStatus(req, res) {
        const { semester_id } = req.params;
        try {
            const findSemester = await Semester.findOne({ where: { semester_id: semester_id } });
            if (!findSemester) return res.status(400).send("Semester does not exist!");
            const status = findSemester.status ? false : true;
            await Semester.update({ status: status }, { where: { semester_id: semester_id } });
            return res.status(200).send("Semester change status successfully!");
        } catch (error) {
            return res.status(500).send("Internal Server Error");
        }
    }


}
module.exports = new SemestersService();