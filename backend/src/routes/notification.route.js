const router = require('express').Router();
const NotificationController=require("../controllers/notification.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");




router.get('/:campus_id/:semester_id',verifyToken,NotificationController.getNotificationByUserId);


module.exports = router;
