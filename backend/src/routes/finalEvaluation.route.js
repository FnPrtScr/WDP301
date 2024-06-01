const router = require('express').Router();
const FinalEvaluationController=require("../controllers/finalEvaluation.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent,verifyTokenLectureAndReviewer}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");


// Reviewer , Lecturer
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id',verifyTokenLectureAndReviewer,FinalEvaluationController.getFinalGraded)
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/g/resit',verifyToken,FinalEvaluationController.getFinalGradedResit)
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id',verifyTokenReviewer,FinalEvaluationController.gradeFinal)
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/resit',verifyToken,FinalEvaluationController.gradeFinalResit)



module.exports = router;
