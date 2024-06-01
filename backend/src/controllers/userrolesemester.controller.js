const asyncHandler = require('../utils/async-handler');
const UserRoleSemesterService = require("../services/userrolesemester.service");
const { errorResponse, successResponse ,ErrorResponse} = require('../utils/response');

module.exports = {

    createOne: asyncHandler(async (req, res) => {
        const urs = await UserRoleSemesterService.createOne(req, res);
    }),
    importLectures: asyncHandler(async (req, res) => {
        const urs = await UserRoleSemesterService.importLectures(req, res);
    }),
    getAllLecture: asyncHandler(async (req, res) => {
        const urs = await UserRoleSemesterService.getAllLecture(req, res);
    }),
    getAllLectureNotPaging: asyncHandler(async (req, res) => {
        const urs = await UserRoleSemesterService.getAllLectureNotPaging(req, res);
    }),
    updateOne: asyncHandler(async (req, res) => {
        const urs = await UserRoleSemesterService.updateOne(req, res);
    }),
    deleteLecture: asyncHandler(async (req, res) => {
        try {
            const urs = await UserRoleSemesterService.deleteLecture(req);
            return res.status(201).send(successResponse(201, urs));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
