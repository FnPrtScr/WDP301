const asyncHandler = require('../utils/async-handler');
const CampusService = require("../services/campus.service");
const { errorResponse, successResponse } = require('../utils/response');

module.exports = {

    getAll: asyncHandler(async (req, res) => {
        const campus = await CampusService.getAll(req, res);
    }),
    createOne: asyncHandler(async (req, res, next) => {
        const campus = await CampusService.createOne(req, res, next);
        if(campus)return res.status(201).send(successResponse(201, campus, "Create Campus successfully"));
        return res.status(500).send(errorResponse());
    }),
    


};
