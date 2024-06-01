const asyncHandler = require('../utils/async-handler');
const SemesterService = require("../services/semester.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    getOne: asyncHandler(async (req, res) => {
        const semester = await SemesterService.getOne(req, res);
    }),
    getDeadlineSemester: asyncHandler(async (req, res) => {
        try {
            const semester = await SemesterService.getDeadlineSemester(req);
            return res.status(200).send(successResponse(200, semester));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

    getAll: asyncHandler(async (req, res) => {
        const semester = await SemesterService.getAll(req, res);
    }),
    createOne: asyncHandler(async (req, res) => {
        const semester = await SemesterService.createOne(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        const semester = await SemesterService.updateOne(req, res);
    }),
    deleteOne: asyncHandler(async (req, res) => {
        const semester = await SemesterService.deleteOne(req, res);
    }),
    changeStatus: asyncHandler(async (req, res) => {
        const semester = await SemesterService.changeStatus(req, res);
    }),
    createOneAndImportUsers: asyncHandler(async (req, res, next) => {
        const semester = await SemesterService.createOneAndImportUsers(req, res, next);
    }),
};
