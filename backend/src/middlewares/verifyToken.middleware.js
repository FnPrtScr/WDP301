const asyncHandler = require('../utils/async-handler');
const jwt = require("jsonwebtoken");
const { ACCESS_KEY } = process.env;

const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        try {
            const user = jwt.verify(accessToken, ACCESS_KEY);
            req.user = user;
            next();
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    } else {
        return res.status(401).json("You are not authenticated");
    }
});

const verifyTokenHeadOfDepartment = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        const isHeadOfDepartment = req.user.roles.some(role => role.Role.role_id === 1);
        if (isHeadOfDepartment) {
            next();
        } else {
            return res.status(403).json("You are not an Head of Department");
        }
    });
});
const verifyTokenLecturer = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        const isLecture = req.user.roles.some(role => role.Role.role_id === 2);
        if (isLecture) {
            next();
        } else {
            return res.status(403).json("You are not an Lecture");
        }
    });
});

const verifyTokenReviewer = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        const isReviewer = req.user.roles.some(role => role.Role.role_id === 3);
        if (isReviewer) {
            next();
        } else {
            return res.status(403).json("You are not an Reviewer");
        }
    });
});
const verifyTokenStudent = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        const isStudent = req.user.roles.some(role => role.Role.role_id === 4);
        if (isStudent) {
            next();
        } else {
            return res.status(403).json("You are not an Student");
        }
    });
});
const verifyTokenLectureAndReviewer = asyncHandler(async (req, res, next) => {
    await verifyToken(req, res, () => {
        const isReviewerAndLecturer = req.user.roles.some(role => role.Role.role_id === 2 || role.Role.role_id === 3);
        if (isReviewerAndLecturer) {
            next();
        } else {
            return res.status(403).json("You are not an Reviewer");
        }
    });
})


module.exports = {
        verifyToken,
        verifyTokenHeadOfDepartment,
        verifyTokenLecturer,
        verifyTokenReviewer,
        verifyTokenStudent,
        verifyTokenLectureAndReviewer
    };
