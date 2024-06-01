const asyncHandler = require('../utils/async-handler');
const LOCEvaluationService = require("../services/locEvaluation.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    gradeForStudent: asyncHandler(async (req, res) => {
        try {
            const locE = await LOCEvaluationService.gradeForStudent(req);
            return res.status(201).send(successResponse(201, locE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getFunctionRequirementScoring: asyncHandler(async (req, res) => {
        try {
            const locE = await LOCEvaluationService.getFunctionRequirementScoring(req);
            return res.status(200).send(successResponse(200, locE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getFuntionRequirementGraded: asyncHandler(async (req, res) => {
        try {
            const locE = await LOCEvaluationService.getFuntionRequirementGraded(req);
            return res.status(200).send(successResponse(200, locE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    checkConditionPresent: asyncHandler(async (req, res) => {
        try {
            const locE = await LOCEvaluationService.checkConditionPresent(req);
            return res.status(200).send(successResponse(200, locE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getTotalLOC: asyncHandler(async (req, res) => {
        try {
            const locE = await LOCEvaluationService.getTotalLOC(req);
            return res.status(200).send(successResponse(200, locE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


};
