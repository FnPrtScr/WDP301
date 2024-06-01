const router = require('express').Router();
const ClassController = require("../controllers/class.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");
const upload = require("../utils/excel-file");

// Head
router.get('/:campus_id/:semester_id', verifyTokenHeadOfDepartment, ClassController.getAll);
router.get('/:campus_id/:semester_id/g/resit-final', verifyToken, ClassController.getClassResit);
router.post('/:campus_id/:semester_id', verifyTokenHeadOfDepartment, ClassController.createOne);
router.post('/:campus_id/:semester_id/import', verifyTokenHeadOfDepartment, upload.single('file'), ClassController.importClasses);
router.put('/:campus_id/:semester_id/:class_id', verifyTokenHeadOfDepartment, ClassController.updateOne);
router.post('/:campus_id/:semester_id/rm-class', verifyTokenHeadOfDepartment, ClassController.deleteOne);
router.post('/:campus_id/:semester_id/:class_id/c/assign-resit', verifyTokenHeadOfDepartment, ClassController.setReviewerResit);

// Lecture
router.get('/:campus_id/:semester_id/mc', verifyTokenLecturer, ClassController.getAllMyClass);
router.get('/:campus_id/:semester_id/:class_id', verifyTokenLecturer, ClassController.getAllStudentInClass);
router.post('/:campus_id/:semester_id/l', verifyTokenLecturer, ClassController.createOneClass);
router.post('/:campus_id/:semester_id/:class_id', verifyTokenLecturer, ClassController.createOneStudentIntoClass);
router.post('/:campus_id/:semester_id/:class_id/import', verifyTokenLecturer, upload.single('file'), ClassController.importStudentIntoClass);
router.post('/:campus_id/:semester_id/:class_id/rm', verifyTokenLecturer, ClassController.removeStudentInClass);
router.put('/:campus_id/:semester_id/l/:class_id', verifyTokenLecturer, ClassController.updateOneClass);
router.put('/:campus_id/:semester_id/:class_id/:student_id', verifyTokenLecturer, ClassController.updateStudentInMyClass);
router.delete('/:campus_id/:semester_id/l/:class_id', verifyTokenLecturer, ClassController.deleteOneClass);

// Student
router.get('/:campus_id/:semester_id/s/mc', verifyTokenStudent, ClassController.getMyClass);


module.exports = router;
