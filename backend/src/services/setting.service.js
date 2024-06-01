const { Setting, sequelize } = require('../models')
const moment = require("moment");

class SettingService {
    async getOne(req, res) {
        try {
            const result = await Setting.findOne({ where: { setting_id: 1 } });
            return res.status(200).send(result);
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
    async updateOne(req, res) {
        try {
            const newData = await Setting.update({ ...req.body }, { where: { setting_id: 1 } });
            return res.status(200).json({msg: 'Updated successfully', data: newData});
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).send("Internal Server Error");
        }
    }

}
module.exports = new SettingService();