// @ts-ignore
const { User, Role, Campus, UserRoleSemester, Semester, sequelize } = require('../models')
const bcrypt = require('bcrypt');
const { ErrorResponse } = require('../utils/response');
class UserService {
    async getOne(req, res) {
        const { email } = req.body;
        try {
            const result = await User.findOne({
                where: { email: email, status: true },
                attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                include: [
                    {
                        model: Campus,
                        attributes: ['campus_id', 'name']
                    }
                    , {
                        model: UserRoleSemester,
                        attributes: ['userRoleSemester_id'],
                        include: [{
                            model: Role,
                            attributes: ['role_id', 'name'],
                        }]
                    }],
            });
            return res.status(200).send(result);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getAllUserRoles(req, res) {
        const { email, campus_id } = req.body;
        try {
            const result = await User.findOne({
                where: { email: email, campus_id: campus_id, status: true },
                include: [{
                    model: UserRoleSemester,
                    attributes: ['userRoleSemester_id'],
                    include: [{
                        model: Role,
                        attributes: ['role_id', 'name'],
                    }]
                }]
            });
            return result;
            // return res.status(200).send(result);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createOne(req, res) {
        const { email, password, campus_id } = req.body;
        try {
            if (req.body.google_id) {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password, salt);
                const rs = await User.update({
                    google_id: req.body.google_id, password: hashedPass, first_name: req.body.first_name, last_name: req.body.last_name, avatar: req.body.avatar
                },
                    {
                        where: { email: email, status: true }
                    });
                if (!rs) return false;
                const findUser = await User.findOne({
                    where: { email: email, campus_id: campus_id, status: true },
                    include: [{
                        model: UserRoleSemester,
                        attributes: ['userRoleSemester_id'],
                        include: [{
                            model: Semester,
                            attributes: ['semester_id', 'name']
                        }, {
                            model: Role,
                            attributes: ['role_id', 'name'],
                        }]
                    }]
                });
                return findUser || false;
            }
            const createOne = await User.create({ email: email, campus_id: campus_id });
            return createOne || false;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async updateOne(req, res) {
        try {
            const result = await User.update({ ...req.body }, { where: { email: req.body.email, status: true } })
            return result;
        } catch (error) {
            console.error(error);
            return res.status(500).send(error.message || 'Internal Server Error');
        }
    }
    async createOneUser(req) {
        const { campus_id, email, code } = req.body;
        try {
            const findOne = await User.findOne({ where: { email: email, campus_id: campus_id, status: true } });
            if (findOne) throw new ErrorResponse(400, "User already exists");
            const createUser = await User.create({
                email: email,
                code: code,
                campus_id: campus_id
            })
            return createUser;
        } catch (error) {
            throw error;
        }
    }
    async createOneUserSuper(req) {
        const { campus_id, email, code ,name_semester} = req.body;
        try {
            const findOne = await User.findOne({ where: { email: email, campus_id: campus_id, status: true } });
            if (findOne) throw new ErrorResponse(400, "User already exists");
            const createUser = await User.create({
                email: email,
                code: code,
                campus_id: campus_id
            })
            const createSemester = await Semester.create({ name: name_semester, campus_id: campus_id });
            const createRoleSemester = await UserRoleSemester.create({ user_id: createUser.user_id, role_id: 1, semester_id: createSemester.semester_id })
            return createUser;
        } catch (error) {
            throw error;
        }
    }

    async getMyProfile(req) {
        const user_id = req.user.id;
        try {
            const myProfile = await User.findOne({
                where: {
                    user_id: user_id,
                    status: true
                }
            })
            const { refresh_token, password, ...others } = myProfile.dataValues
            return { ...others };
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new UserService();