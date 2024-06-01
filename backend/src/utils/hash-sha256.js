'use strict';

const crypto = require('crypto-js');

module.exports = {
    hashSHA256: (code) => {
        const hashedCode = crypto.SHA256(code).toString();
        return hashedCode;
    }
};
