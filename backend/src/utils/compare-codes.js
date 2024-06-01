const hashCode=require("./hash-sha256")

module.exports = {
    conpareCodes: (inputCode,hashedCode) => {
        const hashedInputCode=hashCode.hashSHA256(inputCode);
        if(hashedInputCode !== hashedCode) return false;
        return true;
    }
}