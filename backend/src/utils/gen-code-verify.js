'use strict';

module.exports = {
    generateVerificationCode: () => {
        const codeLength = 6;

        const verificationCode = Math.floor(Math.pow(10, codeLength - 1) + Math.random() * (Math.pow(10, codeLength) - Math.pow(10, codeLength - 1) - 1));

        return verificationCode.toString();
    }
};
