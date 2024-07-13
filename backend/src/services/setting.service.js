const { Setting, sequelize } = require('../models')
const moment = require("moment");

class SettingService {
    //code rac
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
    //

    //Head
    async createOne(req,res){
        const {campus_id,semester_id} =req.params;
        try {
            const createNewSetting=await Setting.create({campus_id:campus_id,semester_id:semester_id,...req.body});
            return createNewSetting;
        } catch (error) {
            throw error;
        }
    }
    async getAll(req, res){
        const {campus_id,semester_id} =req.params;
        try {
            const getNewSetting=await Setting.findAll({where:{campus_id:campus_id,semester_id:semester_id}})
            return getNewSetting
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new SettingService();