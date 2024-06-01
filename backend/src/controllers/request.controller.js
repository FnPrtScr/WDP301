const asyncHandler = require('../utils/async-handler');
const RequestService = require("../services/request.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Lecturer
    getRequest: asyncHandler(async (req, res) => {
        try {
            const request = await RequestService.getRequest(req, res);
            return res.status(200).send(successResponse(200, request));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    acceptOrRejectRequest: asyncHandler(async (req, res) => {
        try {
            const request = await RequestService.acceptOrRejectRequest(req, res);
            return res.status(201).send(successResponse(201, request));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


    // Student
    createRequestProject: asyncHandler(async (req, res) => {
        try {
            const request = await RequestService.createRequestProject(req, res);
            return res.status(201).send(successResponse(201, request));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getRequestByStudent: asyncHandler(async (req, res) => {
        try {
            const request = await RequestService.getRequestByStudent(req, res);
            return res.status(200).send(successResponse(200, request));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),



};
