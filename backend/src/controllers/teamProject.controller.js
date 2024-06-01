const asyncHandler = require('../utils/async-handler');
const TeamProjectService = require("../services/teamProject.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Lecturer
    getAllTeamProject: asyncHandler(async (req, res, next) => {
        try {
            const teamProject = await TeamProjectService.getAllTeamProject(req);
            return res.status(200).send(successResponse(200, teamProject));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    assignProjectIntoTeam: asyncHandler(async (req, res, next) => {
        try {
            const teamProject = await TeamProjectService.assignProjectIntoTeam(req);
            return res.status(201).send(successResponse(201, teamProject,"Assign Project successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    updateTeamProject: asyncHandler(async (req, res, next) => {
        try {
            const teamProject = await TeamProjectService.updateTeamProject(req);
            return res.status(204).send(successResponse(204, teamProject));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    deleteTeamProject: asyncHandler(async (req, res, next) => {
        try {
            const teamProject = await TeamProjectService.deleteTeamProject(req);
            return res.status(204).send(successResponse(204, teamProject, "Delete Team Project successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getProjectByTeamId: asyncHandler(async (req, res) => {
        try {
            const teamProject = await TeamProjectService.getProjectByTeamId(req);
            return res.status(200).send(successResponse(200, teamProject));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

    // Student
    addLinkAndTechProject: asyncHandler(async (req, res, next) => {
        try {
            const teamProject = await TeamProjectService.addLinkAndTechProject(req);
            return res.status(204).send(successResponse(204, teamProject, "Add Link and Teach successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


};
