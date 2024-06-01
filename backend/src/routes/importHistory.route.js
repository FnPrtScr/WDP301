const router = require('express').Router();
const ImportHistoryController = require("../controllers/importHistory.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");




router.get('/:campus_id/:semester_id/class', verifyTokenHeadOfDepartment, ImportHistoryController.getAllImportHisClass);
router.get('/:campus_id/:semester_id/lecturer', verifyTokenHeadOfDepartment, ImportHistoryController.getAllImportHisLecturer);
router.get('/:campus_id/:semester_id/student/:class_id', verifyTokenLecturer, ImportHistoryController.getAllImportHisStudent);


module.exports = router;
