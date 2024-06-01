const asyncHandler = require('../utils/async-handler');
const NotficationService = require("../services/notification.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    getNotificationByUserId: asyncHandler(async (req, res) => {
        try {
            const noti = await NotficationService.getNotificationByUserId(req);
            return res.status(200).send(successResponse(200, noti));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
};
