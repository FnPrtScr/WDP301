const asyncHandler = require('../utils/async-handler');
const PointService = require("../services/point.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Head
    getTopTeamByClass: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.getTopTeamByClass(req);
            return res.status(200).send(successResponse(200, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

    // Lecturer
    getPointByTeam: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.getPointByTeam(req);
            return res.status(200).send(successResponse(200, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getPointByClass: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.getPointByClass(req);
            return res.status(200).send(successResponse(200, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    gradePointAutoByTeam: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.gradePointAutoByTeam(req);
            return res.status(201).send(successResponse(201, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    gradePointManualByStudent: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.gradePointManualByStudent(req);
            return res.status(201).send(successResponse(201, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    updatePointByStudent: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.updatePointByStudent(req);
            return res.status(201).send(successResponse(201, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

    // Student
    getMyPoint: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.getMyPoint(req);
            return res.status(200).send(successResponse(200, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getMyPointByIteration: asyncHandler(async (req, res) => {
        try {
            const point = await PointService.getMyPointByIteration(req);
            return res.status(200).send(successResponse(200, point));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
};
