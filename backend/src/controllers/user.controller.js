const asyncHandler = require('../utils/async-handler');
const UserService = require("../services/user.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    getOne: asyncHandler(async (req, res) => {
        const user = await UserService.getOne(req, res);
    }),

    getAllUserRoles: asyncHandler(async (req, res) => {
        const user = await UserService.getAllUserRoles(req, res);
    }),
    createOne: asyncHandler(async (req, res) => {
        const user = await UserService.createOne(req, res);
    }),
    importUsers: asyncHandler(async (req, res, next) => {
        const user = await UserService.importUsers(req, res, next);
    }),
    createOneUser: asyncHandler(async (req, res, next) => {
        try {
            const user = await UserService.createOneUser(req);
            return res.status(201).send(successResponse(201, user));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    createOneUserSuper: asyncHandler(async (req, res, next) => {
        try {
            const user = await UserService.createOneUserSuper(req);
            return res.status(201).send(successResponse(201, user));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getMyProfile: asyncHandler(async (req, res, next) => {
        try {
            const user = await UserService.getMyProfile(req);
            return res.status(200).send(successResponse(200, user));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    })




};
