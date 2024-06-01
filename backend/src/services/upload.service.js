'use strict';

const cloudinary = require('../../configs/Cloudinary/cloudinary.js');


class UploadService {

    async uploadImageIntoCloudinary(url_image) {
        try {
            const folderName = 'capstone/chats/uploads/images'
            const result = await cloudinary.uploader(url_image, {
                folder: folderName
            })
            return result;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new UploadService();