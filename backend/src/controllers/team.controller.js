const asyncHandler = require('../utils/async-handler');
const TeamService = require("../services/team.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Head
    getAllTeamInClass: asyncHandler(async (req, res, next) => {
        try {
            const team = await TeamService.getAllTeamInClass(req, res, next);
            return res.status(200).send(successResponse(200, team));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    createOne: asyncHandler(async (req, res) => {
        const team = await TeamService.createOne(req, res);
    }),
    addOneStudentIntoTeam: asyncHandler(async (req, res, next) => {
        try {
            const team = await TeamService.addOneStudentIntoTeam(req, res);
            return res.status(201).send(successResponse(201, team, "Add student to team successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    randomTeam: asyncHandler(async (req, res) => {
        const team = await TeamService.randomTeam(req, res);
    }),
    moveStudentIntoOtherTeam: asyncHandler(async (req, res) => {
        const team = await TeamService.moveStudentIntoOtherTeam(req, res);
    }),
    removeMemberOutGroup: asyncHandler(async (req, res) => {
        try {
            const team = await TeamService.removeMemberOutGroup(req, res);
            return res.status(204).send(successResponse(204, team, "Removed member out group"))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    removeTeamInClass: asyncHandler(async (req, res) => {
        try {
            const team = await TeamService.removeTeamInClass(req, res);
            return res.status(201).send(successResponse(201, team, "Removed team successfully"))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    setLeaderInTeam: asyncHandler(async (req, res) => {
        try {
            const team = await TeamService.setLeaderInTeam(req, res);
            return res.status(201).send(successResponse(201, team, "Set Leader successfully"))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

    // Student
    getMyTeam: asyncHandler(async (req, res) => {
        try {
            const team = await TeamService.getMyTeam(req);
            return res.status(200).send(successResponse(200, team))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


};
