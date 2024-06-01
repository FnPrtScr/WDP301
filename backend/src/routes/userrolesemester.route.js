const router = require('express').Router();
const UserRoleSemesterController=require("../controllers/userrolesemester.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecture,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



router.get('/:campus_id/:semester_id',verifyTokenHeadOfDepartment,UserRoleSemesterController.getAllLecture);
router.get('/:campus_id/:semester_id/l',verifyTokenHeadOfDepartment,UserRoleSemesterController.getAllLectureNotPaging);
router.post('/:campus_id/:semester_id',verifyTokenHeadOfDepartment,UserRoleSemesterController.createOne);
router.post('/:campus_id/:semester_id/import',verifyTokenHeadOfDepartment,upload.single('file'),UserRoleSemesterController.importLectures);
router.put('/:campus_id/:semester_id/:user_id',verifyTokenHeadOfDepartment,UserRoleSemesterController.updateOne);
router.delete('/:campus_id/:semester_id/:user_id',verifyTokenHeadOfDepartment,UserRoleSemesterController.deleteLecture);



module.exports = router;
