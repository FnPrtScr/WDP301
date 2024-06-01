const asyncHandler = require('../utils/async-handler');
const ImportHistoryService = require("../services/importHistory.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    getAllImportHisClass: asyncHandler(async (req, res) => {
        try {
            const importHis = await ImportHistoryService.getAllImportHisClass(req);
            return res.status(200).send(successResponse(200, importHis));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getAllImportHisLecturer: asyncHandler(async (req, res) => {
        try {
            const importHis = await ImportHistoryService.getAllImportHisLecturer(req);
            return res.status(200).send(successResponse(200, importHis));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getAllImportHisStudent: asyncHandler(async (req, res) => {
        try {
            const importHis = await ImportHistoryService.getAllImportHisStudent(req);
            return res.status(200).send(successResponse(200, importHis));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
};
