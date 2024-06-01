const router = require('express').Router();
const MilestoneController=require("../controllers/milestone.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");


// Lecturer
router.get('/:campus_id/:semester_id',verifyTokenLecturer,MilestoneController.getAll);


// Student
router.get('/:campus_id/:semester_id/s',verifyTokenStudent,MilestoneController.getAllIteration);

module.exports = router;
