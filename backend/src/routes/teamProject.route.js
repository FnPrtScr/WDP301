const router = require('express').Router();
const TeamProjectController=require("../controllers/teamProject.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");



// Lecturer
router.get('/:campus_id/:semester_id',verifyTokenLecturer,TeamProjectController.getAllTeamProject);
router.post('/:campus_id/:semester_id/assign',verifyTokenLecturer,TeamProjectController.assignProjectIntoTeam);
router.put('/:campus_id/:semester_id/:teamproject_id',verifyTokenLecturer,TeamProjectController.updateTeamProject);
router.delete('/:campus_id/:semester_id/:teamproject_id',verifyTokenLecturer,TeamProjectController.deleteTeamProject);
router.get('/:campus_id/:semester_id/:class_id/:team_id/',verifyTokenLecturer,TeamProjectController.getProjectByTeamId);

// Student
router.put('/:campus_id/:semester_id/s/:teamproject_id',verifyTokenStudent,TeamProjectController.addLinkAndTechProject);


module.exports = router;
