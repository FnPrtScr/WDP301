const asyncHandler = require('../utils/async-handler');
const TeamEvaluationService = require("../services/teamEvaluation.service");
const { errorResponse, successResponse,ErrorResponse } = require('../utils/response');

module.exports = {

    // Lecturer
    gradeTeam: asyncHandler(async (req, res) => {
        try {
            const teamE = await TeamEvaluationService.gradeTeam(req);
            return res.status(201).send(successResponse(201, teamE));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getGradeTeam: asyncHandler(async (req, res) => {
        try {
            const teamE = await TeamEvaluationService.getGradeTeam(req);
            return res.status(200).send(successResponse(200, teamE));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    
};
