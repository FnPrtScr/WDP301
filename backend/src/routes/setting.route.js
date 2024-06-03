const router = require('express').Router();
const SettingController = require("../controllers/setting.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");

router.get('/', verifyToken, SettingController.getOne);
router.put('/update', verifyTokenHeadOfDepartment, SettingController.updateOne);

module.exports = router;
