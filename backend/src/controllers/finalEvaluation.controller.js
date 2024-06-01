const asyncHandler = require('../utils/async-handler');
const FinalEvaluationService = require("../services/finalEvaluation.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    gradeFinal: asyncHandler(async (req, res) => {
        try {
            const finalE = await FinalEvaluationService.gradeFinal(req);
            return res.status(201).send(successResponse(201, finalE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    gradeFinalResit: asyncHandler(async (req, res) => {
        try {
            const finalE = await FinalEvaluationService.gradeFinalResit(req);
            return res.status(201).send(successResponse(201, finalE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getFinalGraded: asyncHandler(async (req, res) => {
        try {
            const finalE = await FinalEvaluationService.getFinalGraded(req);
            return res.status(200).send(successResponse(200, finalE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getFinalGradedResit: asyncHandler(async (req, res) => {
        try {
            const finalE = await FinalEvaluationService.getFinalGradedResit(req);
            return res.status(200).send(successResponse(200, finalE))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


};
