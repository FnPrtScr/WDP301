const router = require('express').Router();
const SettingController = require("../controllers/setting.controller")
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");

router.get('/', verifyToken, SettingController.getOne);
router.put('/update', verifyTokenHeadOfDepartment, SettingController.updateOne);

// Head
router.get('/:campus_id/:semester_id/all', verifyToken, SettingController.getAll);
router.post('/:campus_id/:semester_id/c', verifyTokenHeadOfDepartment, SettingController.createOne);

module.exports = router;
