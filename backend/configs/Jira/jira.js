'use strict';
const { AgileClient } = require("jira.js");

const client = (host, email, apiToken) => {
    return new AgileClient({
        host: host,
        authentication: {
            basic: {
                email: email,
                apiToken: apiToken,
            },
        },
    });
}

module.exports = client;
