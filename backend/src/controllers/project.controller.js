const asyncHandler = require('../utils/async-handler');
const ProjectService = require("../services/project.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    //Lecture
    getAllMyProject: asyncHandler(async (req, res) => {
        const project = await ProjectService.getAllMyProject(req, res);
    }),
    getAllProjectForRequestTopic: asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.getAllProjectForRequestTopic(req);
            return res.status(200).send(successResponse(200, project));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    createOne: asyncHandler(async (req, res) => {
        const project = await ProjectService.createOne(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.updateOne(req, res);
            return res.status(201).send(successResponse(201, project));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    deleteOne: asyncHandler(async (req, res) => {
        const project = await ProjectService.deleteOne(req, res);
    }),

    //Reviewer
    getAllReviewProject: asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.getAllReviewProject(req, res);
            return res.status(200).send(successResponse(200, project));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),


    //Student

    getMyProject: asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.getMyProject(req);
            return res.status(200).send(successResponse(200, project));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getAllProjectFromMyLecturer: asyncHandler(async (req, res) => {
        try {
            const project = await ProjectService.getAllProjectFromMyLecturer(req);
            return res.status(200).send(successResponse(200, project));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
