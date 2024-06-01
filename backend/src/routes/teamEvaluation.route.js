const router = require('express').Router();
const TeamEvaluationDocController=require("../controllers/teamEvaluation.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const uploadZip=require("../utils/zip-rar-file");


// Lecturer
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id',verifyTokenLecturer,TeamEvaluationDocController.getGradeTeam)
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id',verifyTokenLecturer,TeamEvaluationDocController.gradeTeam)


// Student

module.exports = router;
