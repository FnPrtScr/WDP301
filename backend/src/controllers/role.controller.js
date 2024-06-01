const asyncHandler = require('../utils/async-handler');
const RoleService = require("../services/role.service");
const { errorResponse, successResponse } = require('../utils/response');

module.exports = {

    createOne: asyncHandler(async (req, res) => {
        const role = await RoleService.createOne(req, res);
    }),
    importRoles: asyncHandler(async (req, res) => {
        const role = await RoleService.importRoles(req, res);
    }),


};
