const router = require('express').Router();
const ChatGroupController=require("../controllers/chatGroup.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");




router.get('/:campus_id/:semester_id',verifyToken,ChatGroupController.getAll);
router.get('/:campus_id/:semester_id/:chatGroupId',verifyToken,ChatGroupController.getChat);
router.post('/:campus_id/:semester_id/:chatGroupId',verifyToken,ChatGroupController.createMessage);


module.exports = router;
