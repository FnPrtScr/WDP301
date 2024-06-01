const multer = require('multer');
const appRootPath = require('app-root-path');

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `${appRootPath}/public/assets/uploads/zip-rar`);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),

    fileFilter: (req, file, cb) => {
        if (file.mimetype.includes('zip') || file.mimetype.includes('rar')) {
            cb(null, true);
        } else {
            cb('Please upload only excel, pdf, or zip files', false);
        }
    },
});
