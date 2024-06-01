const router = require('express').Router();
const PointController=require("../controllers/point.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");



// Head
router.get('/:campus_id/:semester_id',verifyTokenHeadOfDepartment,PointController.getTopTeamByClass);


// Lecturer
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id',verifyTokenLecturer,PointController.getPointByTeam);
router.get('/:campus_id/:semester_id/:class_id',verifyTokenLecturer,PointController.getPointByClass);
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/auto',verifyTokenLecturer,PointController.gradePointAutoByTeam);
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/manual',verifyTokenLecturer,PointController.gradePointManualByStudent);
router.put('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/:point_id',verifyTokenLecturer,PointController.updatePointByStudent);

// Student
router.get('/:campus_id/:semester_id/st/my-point',verifyTokenStudent,PointController.getMyPoint);
router.get('/:campus_id/:semester_id/:iteration_id/p/st/report-LOC',verifyTokenStudent,PointController.getMyPointByIteration);

module.exports = router;
