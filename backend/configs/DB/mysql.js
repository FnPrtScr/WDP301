'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const { DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_PORT, DB_DIALECT } = process.env;

const development = {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false,
    pool: {
        max: 30,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
};
const test = {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false,
    pool: {
        max: 30,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
};
module.exports = {
    development: {
        ...development,
        // Tạo đối tượng Sequelize với các thuộc tính từ đối tượng "development"
        sequelize: new Sequelize(development.database, development.username, development.password, {
            host: development.host,
            dialect: development.dialect,
            logging: development.logging,
            timezone: '+07:00',
        })
    },
    test: {
        ...test,
        // Tạo đối tượng Sequelize với các thuộc tính từ đối tượng "test"
        sequelize: new Sequelize(test.database, test.username, test.password, {
            host: test.host,
            dialect: test.dialect,
            logging: test.logging,
            timezone: '+07:00',
        })
    },
};
