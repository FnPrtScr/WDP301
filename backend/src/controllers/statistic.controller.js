const asyncHandler = require('../utils/async-handler');
const StatisticService = require("../services/statistic.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Lecturer
    statisticJiraByTeam: asyncHandler(async (req, res) => {
        try {
            const statistic = await StatisticService.statisticJiraByTeam(req);
            return res.status(200).send(successResponse(200, statistic));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    statisticLinkProjectTrackingByTeam: asyncHandler(async (req, res) => {
        try {
            const statistic = await StatisticService.statisticLinkProjectTrackingByTeam(req);
            return res.status(200).send(successResponse(200, statistic));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    statisticLinkGitlabByTeam: asyncHandler(async (req, res) => {
        try {
            const statistic = await StatisticService.statisticLinkGitlabByTeam(req);
            return res.status(200).send(successResponse(200, statistic));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    statisticPassAndNotPass: asyncHandler(async (req, res) => {
        try {
            const statistic = await StatisticService.statisticPassAndNotPass(req);
            return res.status(200).send(successResponse(200, statistic));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


};
