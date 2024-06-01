'use strict';

class ErrorResponse extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

/**
 * errorResponse,successResponse only using for Controllers
 * ErrorResponse using for Services
 */
module.exports = {
    ErrorResponse: ErrorResponse,
    errorResponse: (statusCode, error) => {
        let errorResponse = {};
        switch (statusCode) {
            case 400:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Bad Request' });
                break;
            case 401:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Unauthorized' });
                break;
            case 403:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Forbidden' });
                break;
            case 404:
                errorResponse = Object.assign({}, { success: false, statusCode, error: error || 'Not Found' });
                break;
            default:
                errorResponse = Object.assign({}, { success: false, statusCode: statusCode || 500, error: error || 'Error' });
                break;
        }
        return errorResponse;
    },

    successResponse: (statusCode, data, message) => {
        let successResponse = {};
        switch (statusCode) {
            case 201:
                successResponse = Object.assign({}, { statusCode, data: data || '', message: message || 'Created' });
                break;
            case 202:
                successResponse = Object.assign({}, { statusCode, data: data || '', message: message || 'Accepted' });
                break;
            case 204:
                successResponse = Object.assign({}, { statusCode, data: data || '', message: message || 'Updated' });
                break;
            default:
                successResponse = Object.assign({}, { statusCode: statusCode || 200, data: data || '', message: message || 'Success' });
                break;
        }
        return successResponse;
    },
};
