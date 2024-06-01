const router = require('express').Router();
const SemesterController=require("../controllers/semester.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



router.post('/:campus_id/c',verifyTokenHeadOfDepartment,SemesterController.createOne);
router.post('/',verifyTokenHeadOfDepartment,upload.single('file'),SemesterController.createOneAndImportUsers);
router.post('/g',verifyTokenHeadOfDepartment,SemesterController.getOne);
router.get('/:campus_id/:semester_id/deadline',verifyToken,SemesterController.getDeadlineSemester);
router.get('/:campus_id',verifyTokenHeadOfDepartment,SemesterController.getAll);
router.put('/:campus_id/:semester_id',verifyTokenHeadOfDepartment,SemesterController.updateOne);
router.delete('/:campus_id/:semester_id',verifyTokenHeadOfDepartment,SemesterController.deleteOne);
router.delete('/:campus_id/:semester_id/change',verifyTokenHeadOfDepartment,SemesterController.changeStatus);




module.exports = router;
