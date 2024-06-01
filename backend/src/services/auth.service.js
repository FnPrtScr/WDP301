const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const sendMail = require('../utils/send-mail')
const codeVerify = require('../utils/gen-code-verify');
const hashCode = require('../utils/hash-sha256');
const compareCodes = require('../utils/compare-codes');
const UserService = require("../services/user.service")
const { User ,sequelize} = require('../models');
const { ErrorResponse } = require('../utils/response');
const { REFRESH_KEY, ACCESS_KEY, SERVER_HOST, CLIENT_PORT } = process.env;

class AuthService {


    async genAccessToken(user) {
        return jwt.sign({
            id: user.user_id,
            email: user.email,
            roles: user.UserRoleSemesters,
        }, ACCESS_KEY, { expiresIn: "2h" });
    }
    async genRefreshToken(user) {
        return jwt.sign({
            id: user.user_id,
            email: user.email,
            roles: user.UserRoleSemesters,
        }, REFRESH_KEY, { expiresIn: "365d" });
    }


    async loginUser(req, res) {
        const { email } = req.body;
        try {
            const findOne = await User.findOne({ where: { email: email, status: true } });
            if (!findOne) return res.status(404).send("Not found User!");
            const comparePass = await bcrypt.compare(req.body.password, findOne.password);
            if (!comparePass) return res.status(401).send("Wrong password");

            const { password, refresh_token, ...others } = findOne.dataValues;
            if (findOne && comparePass) {
                const genAccessToken = await this.genAccessToken(findOne);
                const genRefreshToken = await this.genRefreshToken(findOne);

                res.cookie("accessToken", genAccessToken, {
                    httpOnly: false,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                await User.update({ refresh_token: genRefreshToken }, {
                    where: {
                        email: email
                    }
                });
                return res.status(200).json({ ...others });
            }

        } catch (error) {
            return res.status(500).send(error.message || 'Internal Server Error');
        }
    }
    async loginGoogleUser(req, res) {
        const campus = req.query.campus;
        try {
            passport.authenticate('google', { scope: ['email', 'profile'], state: `${campus}` })(req, res);
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }

    async loginSuccess(req, res) {
        if (req.user) {
            res.status(200).json(req.user)
        } else {
            res.status(400).json({ message: "Not Authorized" })
        }
    }

    async logoutUser(req, res) {
        res.clearCookie("accessToken");
        res.status(200).json("Logout successful");
    }

    async refreshAccessToken(req, res) {
        const { email } = req.body;
        const findUser = await User.findOne({ where: { email: email, status: true } });
        if (!findUser) return res.status(404).json("Not found User");

        const getRefreshTokenInDB = findUser.refresh_token;

        try {
            jwt.verify(getRefreshTokenInDB, REFRESH_KEY);

            const newAccessToken = await this.genAccessToken(findUser);
            const newRefreshToken = await this.genRefreshToken(findUser);

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            await User.update({ email: email }, {
                where: {
                    refresh_token: newRefreshToken
                }
            });
            res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            res.status(403).json("Invalid refreshToken");
        }
    }
    async checkUser(req, res) {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            try {
                const user = jwt.verify(accessToken, ACCESS_KEY);

                const currentTimestamp = Math.floor(Date.now() / 1000);
                if (user.exp < currentTimestamp) {
                    return res.status(401).json("Token has expired");
                }

                const findUser = await User.findOne({ where: { email: email, status: true } });
                const { password, refreshToken, ...other } = findUser.dataValues;
                return res.status(200).json({ ...other });
            } catch (err) {
                return res.status(403).json("Token has expired");
            }
        } else {
            return res.status(401).json("You are not authenticated");
        }
    }



}

module.exports = new AuthService();
