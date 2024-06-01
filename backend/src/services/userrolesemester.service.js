const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Semester, UserClassSemester, Milestone, Iteration, ImportHistory, UserRoleSemester, ColectureClass, ReviewerClass, sequelize } = require('../models')
const moment = require("moment");
const Joi = require('joi');
const importDataExcel = require('../imports/import-data-excel');
const exportDataExcel = require('../exports/export-data-excel');
const { ErrorResponse } = require('../utils/response');
const { lowerCase, uppperCase } = require('../utils/format-string')
class UserRoleSemesterService {

    //Head
    async getAllLecture(req, res) {
        try {
            const { campus_id, semester_id } = req.params;

            let { page, limit, keyword } = req.query;

            let where = this.buildQuery(semester_id, campus_id, lowerCase(keyword));

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            const roles = await UserRoleSemester.findAndCountAll({
                where: where,
                attributes: ['userRoleSemester_id', 'user_id', 'role_id', 'semester_id'],
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                        include: [
                            {
                                model: Campus,
                                attributes: ['campus_id', 'name'],
                                required: false
                            }, {
                                model: Class,
                                where: { semester_id: semester_id },
                                attributes: ['class_id', 'name'],
                                required: false
                            }, {
                                model: ColectureClass,
                                where: { semester_id: semester_id },
                                attributes: ['class_id'],
                                include: [
                                    {
                                        model: Class,
                                        attributes: ['class_id', 'name'],
                                    }
                                ],
                                required: false
                            }, {
                                model: ReviewerClass,
                                where: { semester_id: semester_id },
                                attributes: ['class_id'],
                                include: [
                                    {
                                        model: Class,
                                        attributes: ['class_id', 'name'],
                                        required: false
                                    }
                                ],
                                required: false
                            }
                        ],
                        required: false
                    }
                ],
                required: false,
                order: [['createdAt', 'DESC']]
            });

            const groupedRoles = {};
            roles.rows.forEach(role => {
                if (!groupedRoles[role.user_id]) {
                    groupedRoles[role.user_id] = [];
                }
                groupedRoles[role.user_id].push(role);
            });

            const dataArray = Object.entries(groupedRoles).map(([key, value]) => ({ [key]: value }));
            const currentPageCount = dataArray.length;
            const totalPages = Math.ceil(currentPageCount / limit);

            const paginatedDataArray = dataArray.slice(offset, offset + limit);

            return res.status(200).json({
                success: true,
                data: paginatedDataArray,
                total: roles.count,
                totalPages: totalPages,
                currentPageCount: currentPageCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    buildQuery(semester_id, campus_id, keyword) {
        let where = {
            [Op.and]: [
                {
                    [Op.or]: [{ role_id: 2 }, { role_id: 3 }]
                },
                {
                    '$User.campus_id$': campus_id
                },
                {
                    semester_id: semester_id
                },
                {
                    status: true
                }
            ]
        };
        if (keyword) {
            where[Op.and].push({ '$User.email$': { [Op.like]: `%${keyword}%` } })
        }
        return where;
    }
    async getAllLectureNotPaging(req, res) {
        try {
            const { campus_id, semester_id } = req.params;

            let where = this.buildQuery(semester_id, campus_id);

            const roles = await UserRoleSemester.findAndCountAll({
                where: where,
                attributes: ['userRoleSemester_id', 'user_id', 'role_id', 'semester_id'],
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                        include: [
                            {
                                model: Campus,
                                attributes: ['campus_id', 'name'],
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const groupedRoles = {};
            roles.rows.forEach(role => {
                if (!groupedRoles[role.user_id]) {
                    groupedRoles[role.user_id] = [];
                }
                groupedRoles[role.user_id].push(role);
            });

            const dataArray = Object.entries(groupedRoles).map(([key, value]) => ({ [key]: value }));
            return res.status(200).json({
                success: true,
                data: dataArray,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async createOne(req, res) {
        const { campus_id, semester_id } = req.params;
        const { email } = req.body;
        try {
            const emailSchema = Joi.string().email().custom((value, helpers) => {
                if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                    return value;
                }
                return helpers.error('any.invalid');
            }).required();

            const findIteratioFinal = await Milestone.findAll({ where: { semester_id: semester_id } })
            await emailSchema.validateAsync(email.trim().toLowerCase().replace(/\s/g, ''));
            const findUser = await User.findOne({ where: { email: email.trim().toLowerCase().replace(/\s/g, '') } });
            if (findUser) {
                const findUserRoleSemester = await UserRoleSemester.findAll({
                    where: {
                        [Op.and]: [
                            { user_id: findUser.user_id },
                            { semester_id: semester_id },
                            { role_id: 2 },
                            { '$User.campus_id$': campus_id }
                        ]
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                            include: [
                                {
                                    model: Campus,
                                    attributes: ['campus_id', 'name'],
                                }

                            ]
                        }
                    ],
                });
                if (findUserRoleSemester.length !== 0) return res.status(400).send({ success: false, message: "The user already has this role this semester!" })
                let objUrs = {
                    user_id: findUser.user_id,
                    role_id: 2,
                    semester_id: semester_id
                }
                // let objFinalIter = {
                //     milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
                //     name: findIteratioFinal[findIteratioFinal.length - 1].name,
                //     owner_id: findUser.user_id
                // }
                const createUserRoleSemester = await UserRoleSemester.create(objUrs);
                // await Iteration.create(objFinalIter);
                return res.status(200).send({
                    success: true,
                    data: createUserRoleSemester
                })
            }
            let obj = {
                email: email.trim().toLowerCase().replace(/\s/g, ''),
                campus_id: campus_id
            }
            const createOne = await User.create(obj);
            if (!createOne) return res.status(500).send({ success: false, message: "Create user failed!" });
            let objUrs = {
                user_id: createOne.user_id,
                role_id: 2,
                semester_id: semester_id
            }
            // let objFinalIter = {
            //     milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
            //     name: findIteratioFinal[findIteratioFinal.length - 1].name,
            //     owner_id: createOne.user_id
            // }
            const createUserRoleSemester = await UserRoleSemester.create(objUrs);
            // await Iteration.create(objFinalIter);
            if (!createUserRoleSemester) return res.status(500).send({ success: false, message: "User role creation failed" });
            return res.status(200).send({
                success: true,
                data: createUserRoleSemester
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json("Internal Server Error");
        }
    }
    async updateOne(req, res) {
        const { campus_id, user_id, semester_id } = req.params;
        const { email } = req.body;
        try {
            const findUsers = await UserRoleSemester.findAll({
                where: {
                    [Op.and]: [
                        { semester_id: semester_id },
                        { user_id: user_id },
                        { '$User.campus_id$': campus_id }
                    ]
                },
                attributes: ['userRoleSemester_id', 'user_id', 'role_id', 'semester_id', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                        include: [
                            {
                                model: Campus,
                                attributes: ['campus_id', 'name'],
                            }

                        ]
                    }
                ],
            });
            if (findUsers.length <= 0) return res.status(404).json("User not found");
            const checkExistsUser = await User.findOne({ where: { email: lowerCase(email), user_id: { [Op.ne]: user_id }, campus_id: campus_id } });
            if (checkExistsUser) return res.status(400).json("Email already exists");
            await User.update({ email: lowerCase(email) }, {
                where: {
                    user_id: user_id,
                    campus_id: campus_id,
                }
            })
            return res.status(200).json({ success: true, message: "User updated" });
        } catch (error) {
            console.error(error);
            return res.status(500).json("Internal Server Error");
        }
    }
    async importLectures(req, res, next) {
        const { campus_id, semester_id } = req.params;
        const nameFile = `Import-Lecturer`;
        const user_id = req.user.id;
        const pathFileOriginal = req.file.filename;
        let allDataType = [];
        let successes = [];
        let errors = [];
        let errorsDetail = [];
        let countErrors = 0;
        let countSuccess = 0;
        try {
            const datas = await importDataExcel.fncImportDataTypeXLSXhaveHeader(req, res, next);
            let arrDataCreateUser = [];
            let arrDataCreateUserRoleSemester = [];
            let arrDataFinalIter = [];

            const findIteratioFinal = await Milestone.findAll({ where: { semester_id: semester_id } })
            const emailSchema = Joi.string().email().custom((value, helpers) => {
                if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                    return value;
                }
                countErrors++;
                errors.push(value);
                errorsDetail.push(`Email ${value} is not valid`);
                return helpers.error('any.invalid');
            }).required();
            for (let data of datas) {
                if (data.EMAIL !== undefined) {
                    try {
                        await emailSchema.validateAsync(lowerCase(data.EMAIL));
                    } catch (error) {
                        continue;
                    }
                    const findUser = await User.findOne({ where: { email: lowerCase(data.EMAIL) } });
                    if (findUser) {
                        const findUserRoleSemester = await UserRoleSemester.findOne({
                            where: {
                                [Op.and]: [
                                    { user_id: findUser.user_id },
                                    { semester_id: semester_id },
                                    { role_id: 2 },
                                    { '$User.campus_id$': campus_id }
                                ]
                            },
                            include: [
                                {
                                    model: User,
                                    attributes: ['user_id', 'email', 'code', 'campus_id', 'first_name', 'last_name'],
                                    include: [
                                        {
                                            model: Campus,
                                            attributes: ['campus_id', 'name'],
                                        }
                                    ]
                                }
                            ],
                        });
                        if (!findUserRoleSemester) {
                            let objUrs = {
                                user_id: findUser.user_id,
                                role_id: 2,
                                semester_id: semester_id
                            }
                            countSuccess++;
                            successes.push(lowerCase(data.EMAIL))
                            arrDataCreateUserRoleSemester.push(objUrs);
                        } else {
                            countErrors++;
                            errors.push(lowerCase(data.EMAIL));
                            errorsDetail.push(`Email ${data.EMAIL} is available this semester`)
                        }
                    } else {
                        let obj = {
                            email: lowerCase(data.EMAIL),
                            campus_id: campus_id
                        }
                        countSuccess++;
                        successes.push(lowerCase(data.EMAIL))
                        arrDataCreateUser.push(obj);
                    }
                };
            };
            allDataType.push(successes, errors, errorsDetail)
            const createBulk = await User.bulkCreate(arrDataCreateUser);
            createBulk.map((user) => {
                let objUrs = {
                    user_id: user.user_id,
                    role_id: 2,
                    semester_id: semester_id
                }
                // let objFinalIter = {
                //     milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
                //     name: findIteratioFinal[findIteratioFinal.length - 1].name,
                //     owner_id: user.user_id
                // }
                arrDataCreateUserRoleSemester.push(objUrs);
                // arrDataFinalIter.push(objFinalIter);
            });
            const createBulkUrs = await UserRoleSemester.bulkCreate(arrDataCreateUserRoleSemester);
            // await Iteration.bulkCreate(arrDataFinalIter);
            const pathFile = await exportDataExcel.fncExportDataExcel(nameFile, allDataType);
            const inputDataImportHistory = {
                path_file_original: `/public/assets/uploads/${pathFileOriginal}`,
                path_file_successed: `/public/assets/exports/successed/${pathFile.fileSuccessed}`,
                path_file_failed: `/public/assets/exports/failed/${pathFile.fileFailed}`,
                type_import: 'lecturer',
                owner_id: user_id,
                semester_id: semester_id
            };
            const createSynchHistory = await ImportHistory.create({ ...inputDataImportHistory });
            if (countErrors > 0) {
                return res.status(200).send({
                    success: false,
                    message: `Successfully imported ${countSuccess} lecturers, failed ${countErrors} lecturers`
                });
            }
            return res.status(200).send({
                success: true,
                message: `Successfully imported ${countSuccess} lecturers, failed ${countErrors} lecturers`
            });
        } catch (error) {
            return res.status(500).json("Internal Server Error");
        }
    }
    async deleteLecture(req) {
        const { campus_id, semester_id, user_id } = req.params;
        try {
            const findUser = await User.findOne({
                where: {
                    user_id: user_id,
                }
            });
            if (!findUser) throw new ErrorResponse(404, 'Lecturer not found');
            const findMileStone = await Milestone.findAll({ where: { semester_id: semester_id } })
            const milestone_ids = findMileStone.map(milestone => milestone.milestone_id)
            await Iteration.destroy({ where: { milestone_id: milestone_ids, owner_id: user_id } })
            await Class.destroy({
                where: {
                    [Op.or]: {
                        user_id: user_id,
                        owner_id: user_id
                    },
                    campus_id: campus_id,
                    semester_id: semester_id
                }
            });
            return await UserRoleSemester.destroy({
                where: {
                    user_id: user_id,
                    semester_id: semester_id
                }
            })
        } catch (error) {
            throw error;
        }
    }



}
module.exports = new UserRoleSemesterService();