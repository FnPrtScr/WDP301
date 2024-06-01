const asyncHandler = require('../utils/async-handler');
const MilestoneService = require("../services/milestone.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {
    //Lecturer
    getAll: asyncHandler(async (req, res) => {
        try {
            const milestone = await MilestoneService.getAll(req);
            return res.status(200).send(successResponse(200, milestone))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    setDeadlineForIteration: asyncHandler(async (req, res) => {
        try {
            const milestone = await MilestoneService.setDeadlineForIteration(req);
            return res.status(201).send(successResponse(201, milestone))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


    //Student
    getAllIteration: asyncHandler(async (req, res) => {
        try {
            const milestone = await MilestoneService.getAllIteration(req);
            return res.status(200).send(successResponse(200, milestone))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
