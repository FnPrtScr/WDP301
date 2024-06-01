module.exports = {
    uppperCase: (string) => {
        const newString=string.trim().toUpperCase().replace(/\s/g, '')
        return newString;
    },
    lowerCase: (string) => {
        const newString=string.trim().toLowerCase().replace(/\s/g, '')
        return newString;
    }
}