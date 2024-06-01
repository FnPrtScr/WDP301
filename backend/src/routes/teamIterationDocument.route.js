const router = require('express').Router();
const TeamIterDocController=require("../controllers/teamIterationDocument.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const uploadZip=require("../utils/zip-rar-file");


// Lecturer
router.get('/:campus_id/:semester_id/:iteration_id',verifyTokenLecturer,TeamIterDocController.getAllDocumentByIter)
router.get('/:campus_id/:semester_id/:iteration_id/:team_id',verifyTokenLecturer,TeamIterDocController.getDocumentByTeamID)


// Student
router.get('/:campus_id/:semester_id/:iteration_id/st/md',verifyTokenStudent,TeamIterDocController.getDocumentMyTeam)
router.post('/:campus_id/:semester_id/:iteration_id/submit',verifyTokenStudent,uploadZip.single('file'),TeamIterDocController.submitDocument)

module.exports = router;
