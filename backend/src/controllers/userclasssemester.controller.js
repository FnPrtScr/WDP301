const asyncHandler = require('../utils/async-handler');
const UserClassSemesterService = require("../services/userclasssemester.service");
const { errorResponse, successResponse ,ErrorResponse} = require('../utils/response');

module.exports = {

    createOne: asyncHandler(async (req, res) => {
        const ucs = await UserClassSemesterService.createOne(req, res);
    }),
    createBulk: asyncHandler(async (req, res) => {
        const ucs = await UserClassSemesterService.createBulk(req, res);
    }),
    getMyLecturer: asyncHandler(async (req, res) => {
        try {
            const ucs = await UserClassSemesterService.getMyLecturer(req);
            return res.status(200).send(successResponse(200, ucs))
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),



};
