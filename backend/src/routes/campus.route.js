const router = require('express').Router();
const CampusController=require("../controllers/campus.controller")
const {verifyToken,verifyTokenHeadOfDepartment,verifyTokenLecturer,verifyTokenReviewer,verifyTokenStudent}=require("../middlewares/verifyToken.middleware");




router.get('/',CampusController.getAll);
router.post('/',CampusController.createOne);


module.exports = router;
