const router = require('express').Router();
const UserController=require("../controllers/user.controller")
const upload=require("../utils/excel-file");
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");



router.get('/my-profile',verifyToken,UserController.getMyProfile)
router.post('/',verifyToken,UserController.getOne)
router.post('/b',UserController.getAllUserRoles)
router.post('/',UserController.createOne)
router.post('/c',UserController.createOneUser)
router.post('/c/super-user',UserController.createOneUserSuper)
router.post('/import',upload.single('file'),UserController.importUsers)




module.exports = router;
