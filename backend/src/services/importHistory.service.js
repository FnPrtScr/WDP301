const { Campus, ImportHistory, sequelize } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');

class ImportHistoryService {
    async getAllImportHisLecturer(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const getAll = await ImportHistory.findAll({
                where: {
                    owner_id: user_id,
                    type_import: 'lecturer',
                    semester_id: semester_id
                },
                order: [['createdAt', 'DESC']]
            });
            return getAll;
        } catch (error) {
            throw error;
        }
    }
    async getAllImportHisStudent(req) {
        const { campus_id, semester_id } = req.params;
        const { class_id } = req.params
        const user_id = req.user.id;
        try {
            const getAll = await ImportHistory.findAll({
                where: {
                    owner_id: user_id,
                    type_import: 'student',
                    class_id: class_id,
                    semester_id: semester_id
                },
                order: [['createdAt', 'DESC']]
            });
            return getAll;
        } catch (error) {
            throw error;
        }
    }
    async getAllImportHisClass(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const getAll = await ImportHistory.findAll({
                where: {
                    owner_id: user_id,
                    type_import: 'classes',
                    semester_id: semester_id
                },
                order: [['createdAt', 'DESC']]
            });
            return getAll;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new ImportHistoryService();