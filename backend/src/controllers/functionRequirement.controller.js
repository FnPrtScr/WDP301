const asyncHandler = require('../utils/async-handler');
const FunctionRequirementService = require("../services/functionRequirement.service");
const { errorResponse, successResponse,ErrorResponse } = require('../utils/response');

module.exports = {

    getFunctionRequirement: asyncHandler(async (req, res) => {
        const funcReq = await FunctionRequirementService.getFunctionRequirement(req, res);
    }),
    createOne: asyncHandler(async (req, res) => {
        const funcReq = await FunctionRequirementService.createOne(req, res);
    }),
    deleteOne: asyncHandler(async (req, res) => {
        const funcReq = await FunctionRequirementService.deleteOne(req, res);
    }),
    updateOne: asyncHandler(async (req, res, next) => {
        try {
            const funcReq = await FunctionRequirementService.updateOne(req, res, next);
            return res.status(204).send(successResponse(204, funcReq, 'Update FunctionRequirement successfully'));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
