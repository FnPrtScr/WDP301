const router = require('express').Router();
const UserClassSemesterController=require("../controllers/userclasssemester.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



router.post('/',UserClassSemesterController.createOne);
router.post('/b',UserClassSemesterController.createBulk);
router.get('/:campus_id/:semester_id/ml',verifyTokenStudent,UserClassSemesterController.getMyLecturer);



module.exports = router;
