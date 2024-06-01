'use strict';
const { Gitlab } = require('@gitbeaker/rest');


const gitlab = (token) => new Gitlab({
    token: token,
});



module.exports = gitlab
