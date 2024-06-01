const router = require('express').Router();
const ProjectController=require("../controllers/project.controller")
const {verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



// Lecturer
router.get('/:campus_id/:semester_id',verifyTokenLecturer,ProjectController.getAllMyProject);
router.get('/:campus_id/:semester_id/st-request',verifyTokenLecturer,ProjectController.getAllProjectForRequestTopic);
router.post('/:campus_id/:semester_id',verifyTokenLecturer,upload.fields([{ name: 'excelFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]),ProjectController.createOne);
router.put('/:campus_id/:semester_id/:project_id',verifyTokenLecturer,ProjectController.updateOne);
router.delete('/:campus_id/:semester_id/:project_id',verifyTokenLecturer,ProjectController.deleteOne);

// Reviewer
router.get('/:campus_id/:semester_id/:iteration_id/rv',verifyTokenReviewer,ProjectController.getAllReviewProject);

// Student
router.get('/:campus_id/:semester_id/s/mp',verifyTokenStudent,ProjectController.getMyProject);
router.get('/:campus_id/:semester_id/s/allp',verifyTokenStudent,ProjectController.getAllProjectFromMyLecturer);



module.exports = router;
