'use strict';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Joi = require('joi');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_HOST, SERVER_PORT } = process.env;
const UserService = require("../../src/services/user.service")
const { User } = require('../../src/models');
const AuthService = require('../../src/services/auth.service')

passport.serializeUser((user, done) => {
    try {
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const emailSchema = Joi.string().email().custom((value, helpers) => {
    if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
        return value; 
    }
    return helpers.error('any.invalid');
}).required();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${SERVER_HOST}:${SERVER_PORT}/api/v1/auth/google/callback`,
    // callbackURL: `${SERVER_HOST}/api/v1/auth/google/callback`,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    try {
        await emailSchema.validateAsync(userEmail);

        if (userEmail) {
            req.body.email = profile.emails[0].value;
            req.body.campus_id = req.query.state;
            const isEmailExist = await UserService.getAllUserRoles(req, req.res);
            if (!isEmailExist) return req.res.status(404).send({ message: "Email is not in the system!" });
            req.body.password = profile.id;
            req.body.google_id = profile.id;
            req.body.first_name = profile._json.family_name;
            req.body.last_name = profile._json.given_name;
            req.body.avatar = profile._json.picture;
            const insertToMydb = await UserService.createOne(req, req.res);
            if (!insertToMydb) return req.res.status(500).send("Create Failed");
            const { password, refresh_token, ...others } = insertToMydb.dataValues;
            const genAccessToken = await AuthService.genAccessToken(others);
            const genRefreshToken = await AuthService.genRefreshToken(others);

            req.res.cookie("accessToken", genAccessToken, {
                httpOnly: false,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            await User.update({ refresh_token: genRefreshToken }, {
                where: {
                    email: profile.emails[0].value,
                    status: true
                }
            });
            if (others.UserRoleSemesters && others.UserRoleSemesters.length > 0) {
                done(null, others);
            } else {
                done(null,false)
            }
        }
    } catch (error) {
        done(null,false)
    }
}));

module.exports = passport;
