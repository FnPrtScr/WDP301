const router = require('express').Router();
const AuthController = require("../controllers/auth.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const passport = require('passport');
const {SERVER_HOST} = process.env;

router.post('/signup', AuthController.registerUser);
router.post('/verify-code', AuthController.verifyCode);
router.post('/login', AuthController.loginUser);
router.get('/google', AuthController.loginGoogleUser);
router.get('/google/callback', passport.authenticate("google",{
    successRedirect:`http://localhost:3000/choose-role`,
    failureRedirect:"http://localhost:3000/login"
    // successRedirect:`${SERVER_HOST}/choose-role`,
    // failureRedirect:`${SERVER_HOST}/login`
}));
router.get('/login/success', AuthController.loginSuccess);
router.post('/refresh-access-token', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.post('/check-user', AuthController.checkUser);

module.exports = router;
