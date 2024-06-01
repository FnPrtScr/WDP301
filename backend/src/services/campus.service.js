const { Campus ,sequelize} = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');

class CampusService {
    async getAll(req, res) {
        const result = await Campus.findAll({ where: { status: true } });
        return res.status(200).send(result);
    }
    async createOne(req, res, next) {
        const { name } = req.body;
        const t = await sequelize.transaction();
        try {
            const findCampus = await Campus.findOne({ where: { name: name } });
            if (findCampus) {
                await t.rollback();
                return next(new ErrorResponse(400, 'Campus already exists'));
            }
            const result = await Campus.create({ name: name }, { transaction: t });
            await t.commit();
            return result
        } catch (error) {
            await t.rollback();
            return error.message;
        }
    }
    



}
module.exports = new CampusService();