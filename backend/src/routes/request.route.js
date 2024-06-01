const router = require('express').Router();
const RequestController = require("../controllers/request.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");
const upload = require("../utils/excel-file");


// Lecturer
router.get('/:campus_id/:semester_id', verifyTokenLecturer, RequestController.getRequest);
router.put('/:campus_id/:semester_id/aor', verifyTokenLecturer, RequestController.acceptOrRejectRequest);

// Student
router.get('/:campus_id/:semester_id/student', verifyTokenStudent, RequestController.getRequestByStudent);
router.post('/:campus_id/:semester_id', verifyTokenStudent, upload.fields([{ name: 'excelFile', maxCount: 1 }, { name: 'pdfFile', maxCount: 1 }]), RequestController.createRequestProject);


module.exports = router;
