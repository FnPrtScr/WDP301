const asyncHandler = require('../utils/async-handler');
const TeamIterationDocService = require("../services/teamIterationDocument.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Lecturer
    getAllDocumentByIter: asyncHandler(async (req, res) => {
        try {
            const teamIterDoc = await TeamIterationDocService.getAllDocumentByIter(req);
            return res.status(200).send(successResponse(200, teamIterDoc));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getDocumentByTeamID: asyncHandler(async (req, res) => {
        try {
            const teamIterDoc = await TeamIterationDocService.getDocumentByTeamID(req);
            return res.status(200).send(successResponse(200, teamIterDoc));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


    // Student
    submitDocument: asyncHandler(async (req, res) => {
        try {
            const teamIterDoc = await TeamIterationDocService.submitDocument(req);
            return res.status(201).send(successResponse(201, teamIterDoc, "Submit Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getDocumentMyTeam: asyncHandler(async (req, res) => {
        try {
            const teamIterDoc = await TeamIterationDocService.getDocumentMyTeam(req);
            return res.status(200).send(successResponse(200, teamIterDoc));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
};
