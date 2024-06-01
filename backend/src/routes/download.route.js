const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyTokenHeadOfDepartment, verifyTokenLecturer, verifyTokenReviewer, verifyTokenStudent } = require("../middlewares/verifyToken.middleware");
const DownloadCotroller=require('../controllers/download.controller')

router.get('/zip', (req, res) => {
    const name = decodeURIComponent(req.query.n).split('\\').pop();
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'uploads', 'zip-rar', `${name}`);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.setHeader('Content-Type', 'application/zip');
        res.sendFile(filePath);
    } else {
        res.status(404).json('File Not Found');
    }
});
router.get('/pdf', (req, res) => {
    const name = decodeURIComponent(req.query.n).split('\\').pop();
    const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'uploads', `${name}`);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(filePath);
    } else {
        res.status(404).json('File Not Found');
    }
});
router.get('/excel', (req, res) => {
    const name = decodeURIComponent(req.query.n);
    const filePath = path.join(__dirname, '..', '..',`${name}`);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${name.split('\\').pop()}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } else {
        res.status(404).json('File Not Found');
    }
});
router.get('/:campus_id/:semester_id/:iteration_id/:class_id/:team_id/graded',verifyToken,DownloadCotroller.downloadExcel);


module.exports = router;
