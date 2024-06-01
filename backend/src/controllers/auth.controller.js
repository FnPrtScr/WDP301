const asyncHandler = require('../utils/async-handler');
const AuthService=require("../services/auth.service");
const { errorResponse, successResponse } = require('../utils/response');

module.exports = {

    registerUser: asyncHandler(async (req, res) => {
        await AuthService.registerUser(req,res);
    }),
    verifyCode: asyncHandler(async (req, res) => {
        await AuthService.verificationUser(req, res);
    }),
    loginUser: asyncHandler(async (req, res) => {
        await AuthService.loginUser(req, res);
    }),
    loginGoogleUser: asyncHandler(async (req, res) => {
        await AuthService.loginGoogleUser(req, res);
    }),
    googleCallback:asyncHandler(async (req, res) => {
        await AuthService.googleCallbacks(req, res);
    }),
    loginSuccess:asyncHandler(async (req, res) => {
        await AuthService.loginSuccess(req, res);
    }),
    refreshToken:asyncHandler(async (req, res) => {
        await AuthService.refreshAccessToken(req, res);
    }),

    logoutUser:asyncHandler(async (req, res) => {
        await AuthService.logoutUser(req, res);
    }),
    checkUser:asyncHandler(async (req, res) => {
        const user = await AuthService.checkUser(req, res);
    }),
    
};
