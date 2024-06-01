const appRootPath = require('app-root-path');
const path = require('path');
const XLSX = require('xlsx');
const asyncHandler = require('../utils/async-handler');
const moment = require('moment');

const processDataForExcel = async (datas) => {
    const processedData = [];
    datas.forEach((data, index) => {
        const dataRow = {
            "INDEX": index + 1,
            "NAME": data
        };
        processedData.push(dataRow);
    });
    return processedData;
};
module.exports = {
    fncExportDataExcel: async (name, datas) => {
        try {
            // create new book
            const success = XLSX.utils.book_new();
            const failed = XLSX.utils.book_new();
            // convert json data to sheet
            const jtsSuccess = XLSX.utils.json_to_sheet(await processDataForExcel(datas[0]));
            const jtsFailed = XLSX.utils.json_to_sheet(await processDataForExcel(datas[1]));
            const jtsErrorDetails = XLSX.utils.json_to_sheet(await processDataForExcel(datas[2]));
            // style
            jtsSuccess['!cols'] = [{ width: 10 }, { width: 30 }];
            jtsFailed['!cols'] = [{ width: 10 }, { width: 30 }];
            jtsErrorDetails['!cols'] = [{ width: 10 }, { width: 45 }];
            //add sheet to file.xlsx and create sheet name
            XLSX.utils.book_append_sheet(success, jtsSuccess, `${name}-Success`);
            XLSX.utils.book_append_sheet(failed, jtsFailed, `${name}-Failed`);
            XLSX.utils.book_append_sheet(failed, jtsErrorDetails, `${name}-ErrorDetails`);

            //get time now and format
            const timestamp = Date.now();

            // create name file.xlsx
            const fileSuccessed = `${timestamp}-${name}_Success.xlsx`;
            const fileFailed = `${timestamp}-${name}_Failed.xlsx`;
            const filePathSuccessed = path.join(__dirname, '..', '..', 'public', 'assets', 'exports', 'successed', `${fileSuccessed}`);
            const filePathFailed = path.join(__dirname, '..', '..', 'public', 'assets', 'exports', 'failed', `${fileFailed}`);
            XLSX.writeFile(success, filePathSuccessed);
            XLSX.writeFile(failed, filePathFailed);

            return { fileSuccessed, fileFailed };
        } catch (error) {
            return error.message;
        }
    },

};
