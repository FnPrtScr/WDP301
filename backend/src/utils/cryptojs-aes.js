'use strict';
const cryptojs = require('crypto-js');
const { SECRET_KEY_AES } = process.env;

module.exports = {
    aesEncrypt: (params) => {
        const encryptedURI = cryptojs.AES.encrypt(params, SECRET_KEY_AES).toString();
        return encodeURIComponent(encryptedURI);
    },
    aesDecrypt: (encryptedURI) => {
        const decodedURI = decodeURIComponent(encryptedURI);
        const bytes = cryptojs.AES.decrypt(decodedURI, SECRET_KEY_AES);
        return bytes.toString(cryptojs.enc.Utf8);
    }
}