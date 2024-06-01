const router = require('express').Router();
const StatisticController=require("../controllers/statistic.controller")
const {verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent}=require("../middlewares/verifyToken.middleware");



// Lecturer
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/jira', verifyTokenLecturer, StatisticController.statisticJiraByTeam);
router.get('/:campus_id/:semester_id/:class_id/:iteration_id/:team_id/project-tracking', verifyTokenLecturer, StatisticController.statisticLinkProjectTrackingByTeam);
router.get('/:campus_id/:semester_id/:class_id/:iteration_id/:team_id/gitlab', verifyTokenLecturer, StatisticController.statisticLinkGitlabByTeam);
router.get('/:campus_id/:semester_id', verifyTokenHeadOfDepartment, StatisticController.statisticPassAndNotPass);


module.exports = router;
