const asyncHandler = require('../utils/async-handler');
const ChatGroupService = require("../services/chatGroup.service");
const { errorResponse, successResponse,ErrorResponse } = require('../utils/response');

module.exports = {

    getAll: asyncHandler(async (req, res) => {
        try {
            const chatGroup = await ChatGroupService.getAll(req, res);
            return res.status(200).send(successResponse(200, chatGroup))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getChat: asyncHandler(async (req, res) => {
        try {
            const chatGroup = await ChatGroupService.getChat(req, res);
            return res.status(200).send(successResponse(200, chatGroup))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    createMessage: asyncHandler(async (req, res) => {
        try {
            const chatGroup = await ChatGroupService.createMessage(req, res);
            return res.status(201).send(successResponse(201, chatGroup))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
