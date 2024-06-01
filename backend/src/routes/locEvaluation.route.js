const router = require('express').Router();
const LOCEvaluationController = require("../controllers/locEvaluation.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");
const upload = require("../utils/excel-file");


// Lecturer
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id', verifyTokenLecturer, LOCEvaluationController.getFunctionRequirementScoring)
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/check-present', verifyTokenLecturer, LOCEvaluationController.checkConditionPresent)
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/total-LOC', verifyTokenLecturer, LOCEvaluationController.getTotalLOC)
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/graded', verifyTokenLecturer, LOCEvaluationController.getFuntionRequirementGraded)
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id', verifyTokenLecturer, LOCEvaluationController.gradeForStudent)



module.exports = router;
