const router = require('express').Router();
const FunctionRequirementController=require("../controllers/functionRequirement.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



// Lecture
router.get('/:campus_id/:semester_id/:project_id',verifyTokenLecturer,FunctionRequirementController.getFunctionRequirement);
router.post('/:campus_id/:semester_id/:project_id',verifyTokenLecturer,FunctionRequirementController.createOne);
router.put('/:campus_id/:semester_id/:project_id/:fcrqm_id',verifyTokenLecturer,FunctionRequirementController.updateOne);
router.delete('/:campus_id/:semester_id/:project_id/:fcrqm_id',verifyTokenLecturer,FunctionRequirementController.deleteOne);

//Student
router.get('/:campus_id/:semester_id/s/:project_id',verifyTokenStudent,FunctionRequirementController.getFunctionRequirement);


module.exports = router;
