const { UserClassSemester, Semester, Class,ColectureClass, User, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
class UserClassSemesterService {

    async createOne(req, res) {
        const { name } = req.body;
        try {
            const result = await UserClassSemester.create({ name: name });
            return res.status(200).send(result);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async createBulk(req, res) {
        const { arr } = req.body;
        try {
            const result = await UserClassSemester.bulkCreate(arr);
            return res.status(200).send(result);
        } catch (error) {
            res.status(500).send(error);
        }

    }
    async getMyLecturer(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await UserClassSemester.findOne({ where: { user_id: user_id, semester_id: semester_id } });
            if (!findClass) throw new ErrorResponse(404, "Class not found");
            const getMyLecturer = await Class.findOne({
                where: { class_id: findClass.class_id, campus_id: campus_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        as: "Lecture",
                        attributes: ['user_id', 'email', 'first_name', 'last_name'],
                    },
                    {
                        model: ColectureClass,
                        attributes: ['colecture_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'first_name', 'last_name'],
                            }
                        ]
                    }
                ]
            });
            if (!getMyLecturer) throw new ErrorResponse(404, "My Lecturer not found")
            return getMyLecturer;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new UserClassSemesterService();