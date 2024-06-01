const router = require('express').Router();
const TeamController=require("../controllers/team.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");



// Lecturer
router.get('/:campus_id/:semester_id/:class_id',verifyTokenLecturer,TeamController.getAllTeamInClass);
router.post('/:campus_id/:semester_id/:class_id',verifyTokenLecturer,TeamController.createOne);
router.post('/:campus_id/:semester_id/:class_id/add',verifyTokenLecturer,TeamController.addOneStudentIntoTeam);
router.post('/:campus_id/:semester_id/:class_id/rd',verifyTokenLecturer,TeamController.randomTeam);
router.put('/:campus_id/:semester_id/:class_id/:team_id/mv',verifyTokenLecturer,TeamController.moveStudentIntoOtherTeam);
router.delete('/:campus_id/:semester_id/:class_id/:team_id/:student_id/rm',verifyTokenLecturer,TeamController.removeMemberOutGroup);
router.post('/:campus_id/:semester_id/:class_id/rm-t',verifyTokenLecturer,TeamController.removeTeamInClass);
router.post('/:campus_id/:semester_id/:class_id/:team_id',verifyTokenLecturer,TeamController.setLeaderInTeam);
//Reviewer
router.get('/:campus_id/:semester_id/rv/:class_id',verifyTokenReviewer,TeamController.getAllTeamInClass);


// Student
router.get('/:campus_id/:semester_id/s/mt',verifyTokenStudent,TeamController.getMyTeam);

module.exports = router;