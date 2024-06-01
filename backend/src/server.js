require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const compression = require('compression')
const morgan = require('morgan');
const appRootPath = require('app-root-path');
const passportConfig = require('../configs/Google/passport.js');
const { init: IO } = require('../configs/Socketjs/socketio.js');
const session = require('express-session');
const { sequelize } = require('./models');
const ScheduleService = require('../src/services/schedule.service.js')
const { SERVER_PORT, DB_DATABASE, DB_HOST, SECRET_KEY_SESSION, SOCKETIO_PORT } = process.env;
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit')
const { errorResponse } = require('./utils/response.js');

const app = express();
app.use(compression())
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 2 * 60 * 60 * 1000 },
}));

app.use(passportConfig.initialize());
app.use(passportConfig.session());

app.use(
    cors({
        origin: "http://localhost:3000",
        // origin: "https://scms.edu.vn",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
}))

app.use('/public', express.static(appRootPath + '/public'));


app.use(
    '/api/v1',
    require('./routes')
);

app.all('*', (req, res) => {
    return res.status(404).json(errorResponse(404, 'Page Not Found...'));
});

const server = app.listen(SERVER_PORT || 5000, async () => {
    console.log(`>>> Listening on port ${SERVER_PORT || 5000}`);
    try {
        await sequelize.authenticate();
        console.log(`>>> Connected to "${DB_DATABASE}" on "${DB_HOST}"!`);
        // await sequelize.sync({ alter: true });  
        console.log(`>>> Synced data successful`);
        IO(server);
    } catch (error) {
        console.error("Connect mysql faild!", error);
    }
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
