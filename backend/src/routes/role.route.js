const router = require('express').Router();
const RoleController=require("../controllers/role.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");
const upload=require("../utils/excel-file");



router.post('/',RoleController.createOne);
router.post('/import',upload.single('file'),RoleController.importRoles)



module.exports = router;
