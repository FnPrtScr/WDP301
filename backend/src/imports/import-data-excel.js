const appRootPath = require('app-root-path');
const path = require('path');
const xlsx = require('xlsx');
const asyncHandler = require('../utils/async-handler');
const moment = require('moment');
const fs = require('fs');
module.exports = {
    fncImportDataTypeXLSXhaveHeader: asyncHandler(async (req, res, next) => {
        if (req.file === undefined) {
            return res.status(400).send('Please upload an excel file!');
        }
        let path = `${appRootPath}/public/assets/uploads/` + req.file.filename;
        const importExcel = await xlsx.readFile(path);
        const sheet_name_list = importExcel.SheetNames;
        var data = xlsx.utils.sheet_to_json(importExcel.Sheets[sheet_name_list[0]]);
        return data;
    }),
    fncImportFunctionRequirement: asyncHandler(async (req, res, next) => {
        if (req.files.excelFile[0] === undefined) {
            next();
        }
        let path = `${appRootPath}/public/assets/uploads/` + req.files.excelFile[0].filename;
        const importExcel = await xlsx.readFile(path);
        const sheet_name_list = importExcel.SheetNames;
        var data = xlsx.utils.sheet_to_json(importExcel.Sheets[sheet_name_list[0]]);
        fs.unlinkSync(path);
        return data;
    }),
};
