const router = require('express').Router();
const IterationController = require("../controllers/iteration.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");
const upload = require("../utils/excel-file");


// Lecturer
router.get('/:campus_id/:semester_id/:milestone_id/:class_id', verifyTokenLecturer, IterationController.getDeadline);
router.post('/:campus_id/:semester_id/:milestone_id/:class_id', verifyTokenLecturer, IterationController.setDeadlineForIteration);
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/get-st', verifyTokenLecturer, IterationController.getSetting);
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/st', verifyTokenLecturer, IterationController.settingIteration);
router.post('/:campus_id/:semester_id/:iteration_id/:class_id/st/completed', verifyTokenLecturer, IterationController.setCompletedIteration);

// Student
router.get('/:campus_id/:semester_id/:milestone_id/st/get-dl', verifyTokenStudent, IterationController.getDeadlineRoleStudent);

module.exports = router;
