const asyncHandler = require('../utils/async-handler');
const SettingService = require("../services/setting.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');
module.exports = {
    getOne: asyncHandler(async (req, res) => {
        const setting = await SettingService.getOne(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        const setting = await SettingService.updateOne(req, res);
    }),

    // Head
    createOne: asyncHandler(async (req, res) => {
        try {
            const semester = await SettingService.createOne(req);
            return res.status(201).send(successResponse(201, semester));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getAll: asyncHandler(async (req, res) => {
        try {
            const semester = await SettingService.getAll(req);
            return res.status(200).send(successResponse(200, semester));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
};