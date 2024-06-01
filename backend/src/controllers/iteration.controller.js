const asyncHandler = require('../utils/async-handler');
const IterationService = require("../services/iteration.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {
    //Lecturer
    setDeadlineForIteration: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.setDeadlineForIteration(req);
            return res.status(201).send(successResponse(201, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    settingIteration: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.settingIteration(req);
            return res.status(201).send(successResponse(201, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getDeadline: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.getDeadline(req);
            return res.status(200).send(successResponse(200, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getSetting: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.getSetting(req);
            return res.status(200).send(successResponse(200, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getDeadlineRoleStudent: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.getDeadlineRoleStudent(req);
            return res.status(200).send(successResponse(200, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    setCompletedIteration: asyncHandler(async (req, res) => {
        try {
            const iteration = await IterationService.setCompletedIteration(req);
            return res.status(201).send(successResponse(201, iteration))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
