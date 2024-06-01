const asyncHandler = require('../utils/async-handler');
const DownloadService = require("../services/download.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    downloadExcel: asyncHandler(async (req, res) => {
        const download = await DownloadService.downloadExcel(req,res);
        // try {
        //     return res.status(201).send(successResponse(201, role));
        // } catch (error) {
        //     if (error instanceof ErrorResponse) {
        //         return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
        //     } else {
        //         return res.status(500).send(errorResponse(500, error.message));
        //     }
        // }
    }),

};
