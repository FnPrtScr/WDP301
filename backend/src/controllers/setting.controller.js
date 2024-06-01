const asyncHandler = require('../utils/async-handler');
const SettingService = require("../services/setting.service");

module.exports = {
    getOne: asyncHandler(async (req, res) => {
        const setting = await SettingService.getOne(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        const setting = await SettingService.updateOne(req, res);
    }),
};