const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Semester,ChatGroup, Team, TeamUser, ImportHistory, Milestone, Iteration, UserClassSemester, UserRoleSemester, ColectureClass, ReviewerClass, Notification, sequelize } = require('../models')
const moment = require("moment");
const Joi = require('joi');
const fs = require('fs');
const { ErrorResponse } = require('../utils/response');
const importDataExcel = require('../imports/import-data-excel');
const exportDataExcel = require('../exports/export-data-excel');
const TeamService = require("../services/team.service");
const NotficationService = require("../services/notification.service");
const RedisService = require("../services/redis.service")
const templateData = fs.readFileSync('./src/utils/notification.json', 'utf8');
const templates = JSON.parse(templateData);
const { lowerCase, uppperCase } = require('../utils/format-string');
class ClassesService {
    // HEAD
    async getOne(req, res) {
        return res.status(200).send('abcd');
    }
    async createOne(req) {
        const { campus_id, semester_id } = req.params;
        const { reviewers, colectures, name, lecturer_id } = req.body;
        const owner_id = req.user.id
        const quantity = "0/33";
        let arrDataCreateColectureClass = [];
        let arrDataCreateReviewerClass = [];
        let arrDataNoti = [];
        const t = await sequelize.transaction();
        try {
            // const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            // if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findIteratioFinal = await Milestone.findAll({ where: { semester_id: semester_id } }, { transaction: t })
            const findClass = await Class.findOne({ where: { name: uppperCase(name), semester_id: semester_id } }, { transaction: t })
            if (findClass) throw new ErrorResponse(400, "Class already exists!")
            const classes = await Class.create({
                name: uppperCase(name), user_id: lecturer_id ? lecturer_id : null, campus_id: campus_id, semester_id: semester_id, quantity: quantity, owner_id: owner_id
            }, { transaction: t });
            //create chatgroup
            const createChatGroup=await ChatGroup.create({
                class_id: classes.class_id,
                lecturer_id: lecturer_id,
                name:uppperCase(name),
                campus_id: campus_id,
                semester_id: semester_id
            }, { transaction: t });
            if (!createChatGroup){
                throw new ErrorResponse(500, "Create Chat Group Failed!")
            }
            //create chatgroup
            let objFinalIter = {
                milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
                name: findIteratioFinal[findIteratioFinal.length - 1].name,
                owner_id: lecturer_id,
                class_id: classes.class_id
            }
            await Iteration.create(objFinalIter, { transaction: t })
            if (lecturer_id) {
                let objNoti = {
                    user_id: lecturer_id,
                    content: templates['LECTURER']['ASSIGN']['CLASS'].replace('{{className}}', classes.name),
                    semester_id: semester_id,
                    campus_id: campus_id
                }
                arrDataNoti.push(objNoti);
            }
            if (classes) {
                if (colectures.length > 0) {
                    await Promise.all(colectures.map(async (colecture) => {
                        const checkColecture = await Class.findOne({ where: { user_id: colecture, class_id: classes.class_id, campus_id: campus_id, semester_id: semester_id } });
                        const findColectureInClassExists = await ColectureClass.findOne({ where: { colecture_id: Math.abs(colecture), class_id: classes.class_id, semester_id: semester_id, campus_id: campus_id } });
                        if (Math.sign(colecture) === 1 && !checkColecture) {
                            if (!findColectureInClassExists) {
                                let obj = {
                                    colecture_id: colecture,
                                    class_id: classes.class_id,
                                    semester_id: semester_id,
                                    campus_id: campus_id
                                };
                                let objNoti = {
                                    user_id: colecture,
                                    content: templates['COLECTURER']['ASSIGN']['CLASS'].replace('{{className}}', classes.name),
                                    semester_id: semester_id,
                                    campus_id: campus_id
                                };
                                arrDataCreateColectureClass.push(obj);
                                arrDataNoti.push(objNoti);
                            }
                        }
                    }));
                }
                if (reviewers.length > 0) {
                    await Promise.all(reviewers.map(async (reviewer) => {
                        const checkReviewer = await Class.findOne({ where: { user_id: reviewer, class_id: classes.class_id, campus_id: campus_id, semester_id: semester_id } });
                        if (Math.sign(reviewer) === 1 && !checkReviewer) {
                            const findReviewersInClassExists = await ReviewerClass.findOne({ where: { reviewer_id: reviewer, class_id: +classes.class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1 } });
                            const countReviewersInClass = await ReviewerClass.count({ where: { class_id: +classes.class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1 } });
                            await UserRoleSemester.findOrCreate(
                                {
                                    where: { user_id: reviewer, role_id: 3, semester_id: semester_id, status: true },
                                    defaults: {
                                        user_id: +reviewer,
                                        role_id: 3,
                                        semester_id: +semester_id
                                    }
                                }
                            )
                            if (!findReviewersInClassExists && countReviewersInClass < 4) {
                                let obj = {
                                    reviewer_id: reviewer,
                                    class_id: +classes.class_id,
                                    semester_id: semester_id,
                                    campus_id: campus_id,
                                    xnd_review: 1

                                };
                                let objNoti = {
                                    user_id: reviewer,
                                    content: templates['REVIEWER']['ASSIGN']['CLASS'].replace('{{className}}', classes.name),
                                    semester_id: semester_id,
                                    campus_id: campus_id
                                };
                                arrDataCreateReviewerClass.push(obj);
                                arrDataNoti.push(objNoti);
                            }
                        }
                    }));
                }
                const createBulkLC = ColectureClass.bulkCreate(arrDataCreateColectureClass, { transaction: t });
                const createBulkRC = ReviewerClass.bulkCreate(arrDataCreateReviewerClass, { transaction: t });
                const result = await Promise.all([createBulkLC, createBulkRC]);
                await NotficationService.createManyNotification(arrDataNoti, { transaction: t });
                await t.commit();
                return result;
            }
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getAll(req, res) {
        const { campus_id, semester_id } = req.params;
        try {
            let { keyword, filter, page, limit } = req.query;

            let where = this.buildQuery(campus_id, semester_id, keyword, filter);

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            // const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            // if (!checkSemesterActive) return res.status(404).json({
            //     success: false,
            //     message: "This semester is not working"
            // });
            const classes = await Class.findAndCountAll({
                where: where,
                attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: "Lecture",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    },
                    {
                        model: ColectureClass,
                        attributes: ['colecture_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                            }
                        ],
                        required: false
                    },
                    {
                        model: ReviewerClass,
                        where: { xnd_review: 1 },
                        attributes: ['reviewer_id', 'xnd_review'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                            }
                        ],
                        required: false

                    },
                    {
                        model: User,
                        as: "Owner",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    },

                ],
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json({
                success: true,
                data: classes,
                total: classes.count,
                totalPages: Math.ceil(classes.count / limit),
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    buildQuery(campus_id, semester_id, keyword, filter) {
        let where = {
            [Op.and]: [
                {
                    campus_id: campus_id
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
            where[Op.and].push({ name: { [Op.like]: `%${uppperCase(keyword)}%` } })
        }
        return where;
    }

    async updateOne(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const { reviewers, colectures, name, lecturer_id, status } = req.body;
        let arrDataCreateColectureClass = [];
        let arrDataCreateReviewerClass = [];
        let arrDataRemoveColectureClass = [];
        let arrDataRemoveReviewerClass = [];
        let arrNoti = [];
        const t = await sequelize.transaction();
        try {
            // const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            // if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
            if (!findClass) throw new ErrorResponse(404, "Class not found!");
            await Class.update({ name: name, user_id: lecturer_id ? lecturer_id : null, status: status }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } }, { transaction: t });
            const findNewLecturer = await User.findOne({
                where: { user_id: lecturer_id, campus_id: campus_id },
                attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
            })
            if (lecturer_id !== findClass.user_id) {
                let objNotiOldLecture = {
                    user_id: findClass.user_id,
                    content: templates['LECTURER']['REMOVE']['CLASS'].replace('{{lecturerName}}', findNewLecturer.email).replace('{{className}}', findClass.name),
                    semester_id: semester_id,
                    campus_id: campus_id
                }
                let objNotiNewLecturer = {
                    user_id: lecturer_id,
                    content: templates['LECTURER']['ASSIGN']['CLASS'].replace('{{className}}', findClass.name),
                    semester_id: semester_id,
                    campus_id: campus_id
                }
                arrNoti.push(objNotiOldLecture, objNotiNewLecturer)
                await NotficationService.createManyNotification(arrNoti);
            }
            let arrDataNoti = [];
            if (colectures.length > 0) {
                await Promise.all(colectures.map(async (colecture) => {
                    const checkColecture = await Class.findOne({ where: { user_id: colecture, class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
                    const findColectureInClassExists = await ColectureClass.findOne({ where: { colecture_id: Math.abs(colecture), class_id: class_id, semester_id: semester_id, campus_id: campus_id } });
                    if (Math.sign(colecture) === 1 && !checkColecture) {
                        if (!findColectureInClassExists) {
                            let obj = {
                                colecture_id: colecture,
                                class_id: class_id,
                                semester_id: semester_id,
                                campus_id: campus_id
                            };
                            let objNoti = {
                                user_id: colecture,
                                content: templates['COLECTURER']['ASSIGN']['CLASS'].replace('{{className}}', findClass.name),
                                semester_id: semester_id,
                                campus_id: campus_id
                            }
                            arrDataNoti.push(objNoti);
                            arrDataCreateColectureClass.push(obj);
                        }
                    } else if (Math.sign(colecture) === -1 && !checkColecture) {
                        let obj = {
                            colecture_id: Math.abs(colecture),
                            class_id: class_id,
                            semester_id: semester_id,
                            campus_id: campus_id
                        };
                        arrDataRemoveColectureClass.push(obj);
                    }
                }));
            }
            if (reviewers.length > 0) {
                await Promise.all(reviewers.map(async (reviewer) => {
                    const checkReviewer = await Class.findOne({ where: { user_id: reviewer, class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
                    if (Math.sign(reviewer) === 1 && !checkReviewer) {
                        const findReviewersInClassExists = await ReviewerClass.findOne({ where: { reviewer_id: reviewer, class_id: +class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1 } });
                        const countReviewersInClass = await ReviewerClass.count({ where: { class_id: +class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1 } });
                        await UserRoleSemester.findOrCreate(
                            {
                                where: { user_id: reviewer, role_id: 3, semester_id: semester_id, status: true },
                                defaults: {
                                    user_id: +reviewer,
                                    role_id: 3,
                                    semester_id: +semester_id
                                }
                            }
                        )
                        if (!findReviewersInClassExists && countReviewersInClass < 4) {
                            let obj = {
                                reviewer_id: reviewer,
                                xnd_review: 1,
                                class_id: +class_id,
                                semester_id: semester_id,
                                campus_id: campus_id,
                            };
                            let objNoti = {
                                user_id: reviewer,
                                content: templates['REVIEWER']['ASSIGN']['CLASS'].replace('{{className}}', findClass.name),
                                semester_id: semester_id,
                                campus_id: campus_id
                            }
                            arrDataNoti.push(objNoti);
                            arrDataCreateReviewerClass.push(obj);
                        }
                    } else if (Math.sign(reviewer) === -1 && !checkReviewer) {
                        const findReviewersInClassExists = await ReviewerClass.findOne({ where: { reviewer_id: Math.abs(reviewer), class_id: +class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1 } });
                        if (findReviewersInClassExists) {
                            let obj = {
                                reviewer_id: Math.abs(reviewer),
                                class_id: +class_id,
                                semester_id: semester_id,
                                campus_id: campus_id,
                                xnd_review: 1
                            };
                            arrDataRemoveReviewerClass.push(obj);
                        }
                    }
                }));
            }
            let process1 = await this.processRemoveColectureClass(arrDataRemoveColectureClass, findClass.name);
            let process2 = await this.processRemoveReviewerClass(arrDataRemoveReviewerClass, findClass.name);
            await Promise.all([process1, process2]);
            const createBulkLC = ColectureClass.bulkCreate(arrDataCreateColectureClass, { transaction: t });
            const createBulkRC = ReviewerClass.bulkCreate(arrDataCreateReviewerClass, { transaction: t });
            const result = await Promise.all([createBulkLC, createBulkRC]);
            await NotficationService.createManyNotification(arrDataNoti);
            await t.commit();
            return result;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async deleteOne(req) {
        const { campus_id, semester_id } = req.params;
        const { class_ids } = req.body;
        const owner_id = req.user.id;
        let errors = [];
        try {
            // const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            // if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            await Promise.all(class_ids.map(async (class_id) => {
                const findClass = await Class.findOne({
                    where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id },
                    include: [
                        {
                            model: User,
                            as: "Owner",
                            attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                        }
                    ]
                });
                if (!findClass) {
                    errors.push(`Class ${class_id} not found`)
                    return
                }
                if (findClass.owner_id !== owner_id) {
                    errors.push(`Cannot be deleted, this Class was created by Lecturer '${findClass.Owner.email}'`)
                    return
                }
                await ChatGroup.destroy({where:{class_id:class_id,campus_id: campus_id, semester_id: semester_id,status: true }})
                return await Class.destroy({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id, status: true } });
            }))
            if (errors.length > 0) {
                throw new ErrorResponse(500, errors);
            }
            return true;
        } catch (error) {
            throw error;
        }

    }
    async importClasses(req, res, next) {
        const { campus_id, semester_id } = req.params;
        const owner_id = req.user.id
        const nameFile = `Import-Classes`;
        const pathFileOriginal = req.file.filename;
        let allDataType = [];
        let successes = [];
        let errors = [];
        let errorsDetail = [];
        let countErrors = 0;
        let countSuccess = 0;
        const user_id = req.user.id
        try {
            const datas = await importDataExcel.fncImportDataTypeXLSXhaveHeader(req, res, next);
            let arrEmailLecture = [];
            let arrNotHaveEmailLecture = [];
            const emailSchema = Joi.string().custom((value, helpers) => {
                if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                    return value;
                }
                errors.push(value);
                errorsDetail.push(`Email ${value} is not valid`);
                return helpers.error('any.invalid');
            }).required();
            for (const data of datas) {
                if (data.ClassName && data.ClassName !== undefined && data.ClassName !== null) {
                    const checkExistsClass = await Class.findOne({ where: { name: uppperCase(data.ClassName), semester_id: semester_id, campus_id: campus_id } });
                    if (checkExistsClass) {
                        countErrors++;
                        errors.push(uppperCase(data.ClassName));
                        errorsDetail.push(`Class ${uppperCase(data.ClassName)} already exists`);
                    } else {
                        if (data.EmailLecture) {
                            try {
                                await emailSchema.validateAsync(lowerCase(data.EmailLecture));
                            } catch (error) {
                                continue;
                            }
                            countSuccess++;
                            successes.push(uppperCase(data.ClassName));
                            arrEmailLecture.push(data);
                        } else {
                            countSuccess++;
                            successes.push(uppperCase(data.ClassName));
                            arrNotHaveEmailLecture.push(data);
                        }
                    }
                }
            }
            allDataType.push(successes, errors, errorsDetail)
            let resultNotHaveEmail = arrNotHaveEmailLecture.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    uppperCase(t.ClassName) === uppperCase(item.ClassName)
                ))
            );
            let resultEmail = arrEmailLecture.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    uppperCase(t.ClassName) === uppperCase(item.ClassName) &&
                    lowerCase(t.EmailLecture) === lowerCase(item.EmailLecture)
                ))
            );
            let process1 = this.processArrNotHaveEmailLecture(campus_id, semester_id, resultNotHaveEmail, owner_id);
            let process2 = this.processArrEmailLecture(campus_id, semester_id, resultEmail, owner_id);
            await Promise.all([process1, process2]);
            const pathFile = await exportDataExcel.fncExportDataExcel(nameFile, allDataType);
            const inputDataImportHistory = {
                path_file_original: `/public/assets/uploads/${pathFileOriginal}`,
                path_file_successed: `/public/assets/exports/successed/${pathFile.fileSuccessed}`,
                path_file_failed: `/public/assets/exports/failed/${pathFile.fileFailed}`,
                type_import: 'classes',
                owner_id: user_id,
                semester_id: semester_id
            };
            const createSynchHistory = await ImportHistory.create({ ...inputDataImportHistory });
            if (countErrors > 0) {
                return {
                    status: false,
                    message: `Successfully imported ${countSuccess} classes, failed ${countErrors} classses`
                }
            }
            return {
                status: true,
                message: `Successfully imported ${countSuccess} classes, failed ${countErrors} classses`
            }
        } catch (error) {
            throw error;
        }
    }

    async processArrNotHaveEmailLecture(campus_id, semester_id, resultNotHaveEmail, owner_id) {
        let arrDataCreateClassEmpty = [];
        try {
            if (resultNotHaveEmail.length > 0) {
                for (let data of resultNotHaveEmail) {
                    let obj = {
                        name: uppperCase(data.ClassName),
                        campus_id: campus_id,
                        semester_id: semester_id,
                        quantity: "0/33",
                        owner_id: owner_id
                    }
                    arrDataCreateClassEmpty.push(obj);
                }
                await Class.bulkCreate(arrDataCreateClassEmpty);
            }
        } catch (error) {
            throw error;
        }
    }
    async processArrEmailLecture(campus_id, semester_id, resultEmail, owner_id) {
        try {
            if (resultEmail.length > 0) {
                const findIteratioFinal = await Milestone.findAll({ where: { semester_id: semester_id } })
                for (let data of resultEmail) {
                    const findLecturer = await User.findOne({
                        where: {
                            email: lowerCase(data.EmailLecture), campus_id: campus_id
                        }
                    })
                    if (!findLecturer) {
                        const createUser = await User.create({ email: lowerCase(data.EmailLecture), campus_id: campus_id });
                        await UserRoleSemester.create({
                            user_id: createUser.user_id,
                            role_id: 2,
                            semester_id: semester_id
                        });
                        const createClass = await Class.create({
                            name: uppperCase(data.ClassName),
                            user_id: createUser.user_id,
                            campus_id: campus_id,
                            semester_id: semester_id,
                            quantity: "0/33",
                            owner_id: owner_id
                        });
                        let objFinalIter = {
                            milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
                            name: findIteratioFinal[findIteratioFinal.length - 1].name,
                            owner_id: createUser.user_id,
                            class_id: createClass.class_id
                        }
                        await Iteration.create(objFinalIter);
                    } else {
                        const createClass = await Class.create({
                            name: uppperCase(data.ClassName),
                            user_id: findLecturer.user_id,
                            campus_id: campus_id,
                            quantity: "0/33",
                            semester_id: semester_id,
                            owner_id: owner_id
                        })
                        const checkRoleInSemester = await UserRoleSemester.findOne({
                            where: {
                                user_id: findLecturer.user_id,
                                role_id: 2,
                                semester_id: semester_id
                            }
                        })
                        if (!checkRoleInSemester) {
                            await UserRoleSemester.create({
                                user_id: findLecturer.user_id,
                                role_id: 2,
                                semester_id: semester_id
                            })
                        }
                        let objFinalIter = {
                            milestone_id: findIteratioFinal[findIteratioFinal.length - 1].milestone_id,
                            name: findIteratioFinal[findIteratioFinal.length - 1].name,
                            owner_id: findLecturer.user_id,
                            class_id: createClass.class_id
                        }
                        await Iteration.create(objFinalIter);
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    }
    async processRemoveColectureClass(arrDataRemoveColectureClass, className) {
        let arrNoti = [];
        try {
            if (arrDataRemoveColectureClass.length <= 0) return true;
            await Promise.all(arrDataRemoveColectureClass.map(async (rm) => {
                await ColectureClass.destroy({ where: rm });
                let objNoti = {
                    user_id: rm.colecture_id,
                    content: templates['COLECTURER']['REMOVE']['CLASS'].replace('{{className}}', className),
                    semester_id: rm.semester_id,
                    campus_id: rm.campus_id
                }
                arrNoti.push(objNoti)
            }));
            await NotficationService.createManyNotification(arrNoti)
        } catch (error) {
            return error.message;
        }
    }
    async processRemoveReviewerClass(arrDataRemoveReviewerClass, className) {
        let arrNoti = [];
        try {
            if (arrDataRemoveReviewerClass.length <= 0) return true;
            await Promise.all(arrDataRemoveReviewerClass.map(async (rm) => {
                await ReviewerClass.destroy({ where: rm });
                const countReviewerClass = await ReviewerClass.count({ where: { reviewer_id: rm.reviewer_id, xnd_review: 1, class_id: rm.class_id, semester_id: rm.semester_id, campus_id: rm.campus_id } });
                if (countReviewerClass === 0) {
                    await UserRoleSemester.destroy({ where: { user_id: rm.reviewer_id, role_id: 3, semester_id: rm.semester_id } })
                }
                let objNoti = {
                    user_id: rm.reviewer_id,
                    content: templates['REVIEWER']['REMOVE']['CLASS'].replace('{{className}}', className),
                    semester_id: rm.semester_id,
                    campus_id: rm.campus_id
                }
                arrNoti.push(objNoti);
            }));
            await NotficationService.createManyNotification(arrNoti);
        } catch (error) {
            return error.message;
        }
    }
    async processRemoveReviewerResitClass(arrDataRemoveReviewerClass, className) {
        let arrNoti = [];
        try {
            if (arrDataRemoveReviewerClass.length <= 0) return true;
            await Promise.all(arrDataRemoveReviewerClass.map(async (rm) => {
                await ReviewerClass.destroy({ where: rm });
                const countReviewerClass = await ReviewerClass.count({ where: { reviewer_id: rm.reviewer_id, xnd_review: 2, class_id: rm.class_id, semester_id: rm.semester_id, campus_id: rm.campus_id } });
                if (countReviewerClass === 0) {
                    await UserRoleSemester.destroy({ where: { user_id: rm.reviewer_id, role_id: 3, semester_id: rm.semester_id } })
                }
                let objNoti = {
                    user_id: rm.reviewer_id,
                    content: templates['REVIEWER']['REMOVE']['CLASS'].replace('{{className}}', className),
                    semester_id: rm.semester_id,
                    campus_id: rm.campus_id
                }
                arrNoti.push(objNoti);
            }));
            await NotficationService.createManyNotification(arrNoti);
        } catch (error) {
            return error.message;
        }
    }
    async getClassResit(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const keys = `${campus_id}:${semester_id}:finalResit:*`;
            const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
            if (getKeys.length <= 0) [];
            let allHashes = [];
            await Promise.all(getKeys.map(async (key) => {
                const class_id = key.split(':')[3];
                const team_id = key.split(':')[4];
                const hashes = await RedisService.hgetall({ ...req, body: { key: key } });
                let obj = {
                    class_id: class_id,
                    team_id: team_id,
                    student: hashes
                }
                allHashes.push(obj)
            }));
            const groupedByClassAndTeam = allHashes.reduce((acc, curr) => {
                const { class_id, team_id, student: { student_id, iteration_id } } = curr;
                acc[class_id] = acc[class_id] || [];
                const existingTeam = acc[class_id].find(team => team.team_id === team_id);
                if (existingTeam) {
                    existingTeam.students.push({ student_id });
                } else {
                    acc[class_id].push({
                        team_id,
                        iteration_id,
                        students: [{ student_id }]
                    });
                }
                return acc;
            }, {});

            const output = Object.entries(groupedByClassAndTeam).map(([class_id, teams]) => ({
                class_id,
                teams
            }));
            let arrClasses = [];
            await Promise.all(output.map(async (classe) => {
                const getClass = await Class.findOne({
                    where: {
                        class_id: +classe.class_id
                    },
                    attributes: ['class_id', 'name'],
                    include: [
                        {
                            model: User,
                            as: 'Lecture',
                            attributes: ['user_id', 'email']
                        },
                        {
                            model: ColectureClass,
                            attributes: ['colecture_id'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['user_id', 'email']
                                }
                            ]
                        },
                        {
                            model: ReviewerClass,
                            where: { xnd_review: 1 },
                            attributes: ['reviewer_id', 'xnd_review'],
                            include: [
                                {
                                    model: User,
                                    attributes: ['user_id', 'email']
                                }
                            ]
                        }
                    ]
                })
                let arrTeam = [];
                await Promise.all(classe.teams.map(async (team) => {
                    const getReviewers = await ReviewerClass.findAll({
                        where: {
                            xnd_review: 2,
                            class_id: +classe.class_id,
                            campus_id: campus_id,
                            semester_id: semester_id,
                        },
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email']
                            }
                        ]
                    });
                    const te = await Team.findOne({
                        where: {
                            team_id: team.team_id
                        }, attributes: ['team_id', 'name']
                    });
                    const keyStudent = `${campus_id}:${semester_id}:finalResit:${+classe.class_id}:${+team.team_id}:getFinalResit:*`;
                    const getKeysSt = await RedisService.keys({ ...req, body: { pattern: keyStudent } });
                    if (getKeysSt.length <= 0) [];
                    let allHashesCo = [];
                    await Promise.all(getKeysSt.map(async (keyst) => {
                        const hashes = await RedisService.hgetall({ ...req, body: { key: keyst } });

                        const getStudent = await User.findOne({
                            where: {
                                user_id: hashes.student_id
                            },
                            attributes: ['user_id', 'email']
                        })
                        allHashesCo.push(getStudent)
                    }));
                    arrTeam.push({ te, allHashesCo, getReviewers });
                }))
                arrClasses.push({ getClass, arrTeam })
            }));
            return arrClasses;
        } catch (error) {
            throw error;
        }
    }
    async setReviewerResit(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const { reviewers_id } = req.body;
        let arrDataCreateReviewerClass = [];
        let arrDataNoti = [];
        let arrDataRemoveReviewerClass = [];
        const user_id = req.user.id;
        try {
            const findClass = await Class.findOne({ where: { class_id: class_id, semester_id: semester_id, campus_id: campus_id } })
            if (!findClass) throw new ErrorResponse(404, "Class not found")
            if (reviewers_id.length > 0) {
                await Promise.all(reviewers_id.map(async (reviewer) => {
                    const checkReviewer = await Class.findOne({ where: { user_id: reviewer, class_id: findClass.class_id, campus_id: campus_id, semester_id: semester_id } });
                    if (Math.sign(reviewer) === 1 && !checkReviewer) {
                        const findReviewersInClassExists = await ReviewerClass.findOne({ where: { reviewer_id: reviewer, xnd_review: 2, class_id: +findClass.class_id, semester_id: semester_id, campus_id: campus_id } });
                        const countReviewersInClass = await ReviewerClass.count({ where: { class_id: +findClass.class_id, xnd_review: 2, semester_id: semester_id, campus_id: campus_id } });
                        await UserRoleSemester.findOrCreate(
                            {
                                where: { user_id: reviewer, role_id: 3, semester_id: semester_id, status: true },
                                defaults: {
                                    user_id: +reviewer,
                                    role_id: 3,
                                    semester_id: +semester_id
                                }
                            }
                        )
                        if (!findReviewersInClassExists && countReviewersInClass < 4) {
                            let obj = {
                                reviewer_id: reviewer,
                                xnd_review: 2,
                                class_id: +findClass.class_id,
                                semester_id: semester_id,
                                campus_id: campus_id,

                            };
                            let objNoti = {
                                user_id: reviewer,
                                content: templates['REVIEWER']['ASSIGNRESIT'].replace('{{className}}', findClass.name),
                                semester_id: semester_id,
                                campus_id: campus_id
                            };
                            arrDataCreateReviewerClass.push(obj);
                            arrDataNoti.push(objNoti);
                        }
                    } else if (Math.sign(reviewer) === -1 && !checkReviewer) {
                        const findReviewersInClassExists = await ReviewerClass.findOne({ where: { reviewer_id: Math.abs(reviewer), class_id: +class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 2 } });
                        if (findReviewersInClassExists) {
                            let obj = {
                                reviewer_id: Math.abs(reviewer),
                                class_id: +class_id,
                                semester_id: semester_id,
                                campus_id: campus_id,
                                xnd_review: 2
                            };
                            arrDataRemoveReviewerClass.push(obj);
                        }
                    }
                }));
            }
            let process2 = await this.processRemoveReviewerResitClass(arrDataRemoveReviewerClass, findClass.name);
            await Promise.all([process2]);
            const createBulkRC = ReviewerClass.bulkCreate(arrDataCreateReviewerClass);
            await Promise.all([createBulkRC]);
            await NotficationService.createManyNotification(arrDataNoti);
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Lecture
    async getAllMyClass(req, res) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            let { keyword, filter, page, limit } = req.query;

            let where = this.buildQueryGetAllMyClass(campus_id, semester_id, user_id, uppperCase(keyword), filter);

            // page = parseInt(page) || 1;
            // limit = parseInt(limit) || 12;
            // const offset = (page - 1) * limit;

            const classes = await Class.findAndCountAll({
                where: where,
                attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                include: [
                    {
                        model: User,
                        as: "Lecture",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                    },
                    {
                        model: ColectureClass,
                        attributes: ['colecture_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                            }
                        ]
                    },
                    {
                        model: ReviewerClass,
                        attributes: ['reviewer_id'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                            }
                        ]

                    },
                    {
                        model: User,
                        as: "Owner",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                    }

                ],
                // offset: offset,
                // limit: limit,
                order: [['createdAt', 'DESC']]
            });
            const getAllClassCoLecture = await ColectureClass.findAndCountAll({
                where: {
                    campus_id: campus_id,
                    semester_id: semester_id,
                    colecture_id: user_id,
                    status: true
                },
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                        include: [
                            {
                                model: User,
                                as: "Lecture",
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                            },
                            {
                                model: ColectureClass,
                                attributes: ['colecture_id'],
                                include: [
                                    {
                                        model: User,
                                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                                    }
                                ]
                            },
                            {
                                model: ReviewerClass,
                                attributes: ['reviewer_id'],
                                include: [
                                    {
                                        model: User,
                                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                                    }
                                ]

                            },
                            {
                                model: User,
                                as: "Owner",
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name', 'avatar'],
                            }

                        ],
                        // offset: offset,
                        // limit: limit,
                        order: [['createdAt', 'DESC']]
                    }
                ]
            });
            let colecturerClass = getAllClassCoLecture.rows.map(colectureClass => colectureClass.Class);
            classes.rows.push(...colecturerClass);
            return res.status(200).json({
                success: true,
                data: classes,
                // total: classes.count,
                // totalPages: Math.ceil(classes.count / limit),
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async createOneClass(req) {
        const { campus_id, semester_id } = req.params;
        const { name } = req.body;
        const quantity = "0/33";
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { name: uppperCase(name), semester_id: semester_id } });
            if (findClass) throw new ErrorResponse(400, "Class already exists");
            const createClass = await Class.create({ ...req.body, name: uppperCase(name), user_id: user_id, quantity: quantity, campus_id: campus_id, semester_id: semester_id, owner_id: user_id });
            if (!createClass) throw new ErrorResponse(500, "Create class failed");
            // req.params.class_id=createClass.class_id
            // await RedisService.createRoomChat(req);
            return createClass;
        } catch (error) {
            throw error;
        }
    }
    async updateOneClass(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const { name } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id, campus_id: campus_id, semester_id: semester_id } });
            const findColectureClass = await ColectureClass.findOne({
                where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true },
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                    },
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found");
            if (!findClass && findColectureClass) throw new ErrorResponse(400, "You do not have the right to edit the class name");
            const updateClass = await Class.update({ ...req.body, name: uppperCase(name) }, { where: { user_id: user_id, campus_id: campus_id, semester_id: semester_id, class_id: class_id } });
            return updateClass;
        } catch (error) {
            throw error;
        }
    }
    buildQueryGetAllMyClass(campus_id, semester_id, user_id, keyword, filter) {
        let where = {
            [Op.and]: [
                {
                    campus_id: campus_id
                },
                {
                    semester_id: semester_id
                },
                {
                    user_id: user_id
                },
                // {
                //     status: true
                // }
            ]

        };
        if (keyword) {
            where[Op.and].push({ name: { [Op.like]: `%${keyword}%` } })
        }
        return where;
    }
    async getAllStudentInClass(req, res) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            let { keyword, filter, page, limit } = req.query;

            let where = this.buildQueryGetAllStudentInClass(class_id, lowerCase(keyword));

            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            if (!findClass && !findColectureClass) return res.status(404).send({ message: "Class not found!" })
            const getStudentInClass = await UserClassSemester.findAndCountAll({
                where: where,
                attributes: ['user_id', 'class_id'],
                include: [
                    {
                        model: User,
                        attributes: ['email', 'code', 'avatar', 'first_name', 'last_name'],
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json({
                success: true,
                data: getStudentInClass,
                total: getStudentInClass.count,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    buildQueryGetAllStudentInClass(class_id, keyword) {
        let where = {
            [Op.and]: [
                {
                    class_id: class_id
                },
                {
                    status: true
                }
            ]

        };
        if (keyword) {
            where[Op.and].push({ '$User.email$': { [Op.like]: `%${keyword}%` } });
        }
        return where;
    }

    async createOneStudentIntoClass(req, res) {
        const { campus_id, semester_id, class_id } = req.params;
        const { email_student, code } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const emailSchema = Joi.string().email().custom((value, helpers) => {
                if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                    return value;
                }
                return helpers.error('any.invalid');
            }).required();
            await emailSchema.validateAsync(lowerCase(email_student));
            const findClass = await Class.findOne({
                where: { class_id: class_id, user_id: user_id, status: true },
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });

            const findColectureClass = await ColectureClass.findOne({
                where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true },
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                    },
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });

            if (!findClass && !findColectureClass) {
                return res.status(404).send({ message: 'Class not found' });
            }

            const maxStudents = 33;
            const classQuantity = findClass ? findClass.quantity.split('/')[0] : findColectureClass.Class.quantity.split('/')[0];
            if (classQuantity >= maxStudents) {
                return res.status(500).send({ message: `This class has ${maxStudents} students!` });
            }

            let findStudent = await User.findOne({ where: { email: lowerCase(email_student), campus_id: campus_id, status: true } });
            let createStudent = false;

            if (!findStudent) {
                findStudent = await User.create({ email: lowerCase(email_student), code: uppperCase(code), campus_id: campus_id });
                if (!findStudent) {
                    return res.status(500).send({ success: false, message: "Create student failed!" });
                }
                createStudent = true;
            }
            const checkRole = await UserRoleSemester.findOne({
                where: {
                    user_id: findStudent.user_id,
                    [Op.or]: [
                        { role_id: 1 },
                        { role_id: 2 },
                        { role_id: 3 }
                    ]
                }
            });
            if (checkRole) return res.status(500).send({ success: false, message: "Cannot add Lecturer to class" });
            const findRoleStudent = await UserRoleSemester.findOne({ where: { user_id: findStudent.user_id, role_id: 4, semester_id: semester_id, status: true } });
            if (!findRoleStudent) {
                await UserRoleSemester.create({ user_id: findStudent.user_id, role_id: 4, semester_id: semester_id });
            }

            const findUCS = await UserClassSemester.findAll({ where: { user_id: findStudent.user_id, semester_id: semester_id } });
            if (findUCS.length > 0) {
                return res.status(400).send({ success: false, message: "Student already exists in Class!" });
            }

            const objUCS = {
                user_id: findStudent.user_id,
                class_id: class_id,
                semester_id: semester_id
            };

            const addStudentIntoClass = await UserClassSemester.create(objUCS);

            const lectureEmail = findClass ? findClass.Lecture.email : findColectureClass.User.email;
            const className = findClass ? findClass.name : findColectureClass.Class.name;

            const objNotification = {
                user_id: findStudent.user_id,
                content: templates['STUDENT']['INVITE'].replace('{{lecturerName}}', lectureEmail).replace('{{className}}', className),
                semester_id: semester_id,
                campus_id: campus_id
            };

            await NotficationService.createNotification(objNotification)

            const countStudentInClass = await UserClassSemester.count({ where: { class_id: class_id } });
            const quantity = `${countStudentInClass}/${maxStudents}`;
            await Class.update({ quantity: quantity }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });

            const message = createStudent ? "Create Student Successful!" : "Student added to class successfully!";
            return res.status(200).send({ success: true, message: message, data: addStudentIntoClass });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateStudentInMyClass(req) {
        const { campus_id, semester_id, class_id, student_id } = req.params;
        const { email_student, code } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const emailSchema = Joi.string().email().custom((value, helpers) => {
                if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                    return value;
                }
                return helpers.error('any.invalid');
            }).required();
            await emailSchema.validateAsync(lowerCase(email_student));
            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id, status: true } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, 'Class not found');
            const findStudent = await User.findOne({
                where: {
                    email: lowerCase(email_student),
                    user_id: {
                        [Op.ne]: student_id
                    },
                    campus_id: campus_id,
                    status: true
                }
            });
            if (findStudent) throw new ErrorResponse(404, 'Email Student already exists');
            return await User.update({ email: lowerCase(email_student), code: uppperCase(code) }, { where: { user_id: student_id, campus_id: campus_id, status: true } });
        } catch (error) {
            throw error;
        }
    }

    async importStudentIntoClass(req, res, next) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        let arrDataNotHaveInSystem = [];
        let arrDataHasInSystem = [];
        const nameFile = `Import-Student`;
        const pathFileOriginal = req.file.filename;
        let allDataType = [];
        let successes = [];
        let errors = [];
        let errorsDetail = [];
        let countErrors = 0;
        let countSuccess = 0;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const datas = await importDataExcel.fncImportDataTypeXLSXhaveHeader(req, res, next);
            const seen = new Set();
            const uniqueDatas = datas.filter(data => {
                const key = `${lowerCase(data.Student)}-${uppperCase(String(data.RollNumber))}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    return true;
                }
                return false;
            });

            const findClass = await Class.findOne({
                where: { class_id: +class_id, user_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true },
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });
            if (+findClass.quantity.split('/')[0] >= 33) return res.status(500).send({ message: 'This class has reached 33 students' })
            const findColectureClass = await ColectureClass.findOne({
                where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true },
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'user_id', 'quantity', 'status', 'owner_id', 'createdAt'],
                    },
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });

            if (!findClass && !findColectureClass) {
                return res.status(404).send({ message: 'Class not found' });
            }
            for (const data of uniqueDatas) {
                const emailSchema = Joi.string().email().custom((value, helpers) => {
                    if (value.endsWith('@fpt.edu.vn') || value.endsWith('@fe.edu.vn')) {
                        return value;
                    }
                    countErrors++;
                    errors.push(value);
                    errorsDetail.push(`Email ${value} is not valid`);
                    return helpers.error('any.invalid');
                }).required();
                try {
                    await emailSchema.validateAsync(lowerCase(data.Student));
                } catch (error) {
                    continue;
                }
                const findStudent = await User.findOne({ where: { email: lowerCase(data.Student), campus_id: campus_id, status: true } });
                if (findStudent) {
                    const checkStudentExistsInOtherClass = await UserClassSemester.findOne({ where: { user_id: findStudent.user_id, semester_id: semester_id } });
                    if (!checkStudentExistsInOtherClass) {
                        countSuccess++;
                        successes.push(lowerCase(data.Student));
                        const [roleStudent, created] = await UserRoleSemester.findOrCreate({
                            where: { user_id: findStudent.user_id, role_id: 4, semester_id: semester_id, status: true },
                            defaults: {
                                user_id: +findStudent.user_id,
                                role_id: 4,
                                semester_id: +semester_id
                            },
                        });
                        if (created) {
                            const findUCS = await UserClassSemester.findOne({ where: { user_id: findStudent.user_id, class_id: +class_id, status: true } });
                            if (!findUCS) {
                                let obj = {
                                    user_id: +findStudent.user_id,
                                    class_id: +class_id,
                                    semester_id: semester_id
                                }
                                arrDataHasInSystem.push(obj);
                            }
                        } else {
                            let obj = {
                                user_id: +findStudent.user_id,
                                class_id: +class_id,
                                semester_id: semester_id
                            }
                            arrDataHasInSystem.push(obj);
                        }
                    } else {
                        countErrors++;
                        errors.push(lowerCase(data.Student))
                        errorsDetail.push(`Student whose email ${lowerCase(data.Student)} already exists in your class or another class`)
                    }
                } else {
                    let obj = {
                        email: lowerCase(data.Student),
                        first_name: data.Name ? data.Name : "",
                        last_name: "",
                        code: String(data.RollNumber),
                        campus_id: +campus_id,
                    }
                    countSuccess++;
                    successes.push(lowerCase(data.Student));
                    arrDataNotHaveInSystem.push(obj);
                }
            }
            allDataType.push(successes, errors, errorsDetail)
            const lectureEmail = findClass ? findClass.Lecture.email : findColectureClass.User.email;
            const className = findClass ? findClass.name : findColectureClass.Class.name;
            let promise1 = this.processArrHasInSystem(campus_id, semester_id, class_id, lectureEmail, className, arrDataHasInSystem);
            let promise2 = this.processArrNotHaveInSystem(campus_id, semester_id, class_id, lectureEmail, className, arrDataNotHaveInSystem);

            await Promise.all([promise1, promise2]);

            const pathFile = await exportDataExcel.fncExportDataExcel(nameFile, allDataType);
            const inputDataImportHistory = {
                path_file_original: `/public/assets/uploads/${pathFileOriginal}`,
                path_file_successed: `/public/assets/exports/successed/${pathFile.fileSuccessed}`,
                path_file_failed: `/public/assets/exports/failed/${pathFile.fileFailed}`,
                type_import: 'student',
                class_id: +class_id,
                owner_id: user_id,
                semester_id: semester_id
            };
            const createSynchHistory = await ImportHistory.create({ ...inputDataImportHistory });
            if (countErrors > 0) {
                return res.status(200).json({
                    success: false,
                    message: `Successfully imported ${countSuccess} students, failed ${countErrors} students`
                });
            }
            return res.status(200).json({
                success: true,
                message: `Successfully imported ${countSuccess} students, failed ${countErrors} students`
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async processArrHasInSystem(campus_id, semester_id, class_id, emailLecturer, className, arrDataHasInSystem) {
        let arrDataUCS = [];
        let arrDataNoti = [];
        try {
            for (const data of arrDataHasInSystem) {
                const findUCS = await UserClassSemester.findOne({ where: { user_id: data.user_id, class_id: data.class_id, semester_id: semester_id } });
                if (!findUCS) {
                    arrDataUCS.push(data);
                    let obj = {
                        user_id: data.user_id,
                        content: templates['STUDENT']['INVITE'].replace('{{lecturerName}}', emailLecturer).replace('{{className}}', className),
                        semester_id: semester_id,
                        campus_id: campus_id
                    }
                    arrDataNoti.push(obj)
                }
            }
            await UserClassSemester.bulkCreate(arrDataUCS);
            // await Notification.bulkCreate(arrDataNoti);
            await NotficationService.createManyNotification(arrDataNoti);
            const countStudentInClass = await UserClassSemester.count({ where: { class_id: class_id } });
            const quantity = `${countStudentInClass}/33`
            await Class.update({ quantity: quantity }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async processArrNotHaveInSystem(campus_id, semester_id, class_id, emailLecturer, className, arrDataNotHaveInSystem) {
        let arrDataURS = [];
        let arrDataUCS = [];
        let arrDataNoti = [];
        try {
            const createBulkUser = await User.bulkCreate(arrDataNotHaveInSystem);
            if (createBulkUser.length > 0) {
                createBulkUser.map((user) => {
                    let objArrURS = {
                        user_id: user.user_id,
                        role_id: 4,
                        semester_id: +semester_id
                    }
                    let objArrUCS = {
                        user_id: user.user_id,
                        class_id: class_id,
                        semester_id: +semester_id
                    }
                    let objNoti = {
                        user_id: user.user_id,
                        content: templates['STUDENT']['INVITE'].replace('{{lecturerName}}', emailLecturer).replace('{{className}}', className),
                        semester_id: semester_id,
                        campus_id: campus_id
                    }
                    arrDataURS.push(objArrURS);
                    arrDataUCS.push(objArrUCS)
                    arrDataNoti.push(objNoti)
                });
                const createBulkURS = await UserRoleSemester.bulkCreate(arrDataURS);
                if (createBulkURS.length > 0) {
                    await UserClassSemester.bulkCreate(arrDataUCS);
                    // await Notification.bulkCreate(arrDataNoti);
                    await NotficationService.createManyNotification(arrDataNoti);
                    const countStudentInClass = await UserClassSemester.count({ where: { class_id: class_id } });
                    const quantity = `${countStudentInClass}/33`
                    await Class.update({ quantity: quantity }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async removeStudentInClass(req, res, next) {
        const { campus_id, semester_id, class_id } = req.params;
        const { students_ids } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findClass = await Class.findOne({ where: { class_id: +class_id, user_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } });
            if (!findClass) return res.status(404).send("Class Not Found");
            let shouldContinue = true;
            await Promise.all(students_ids.map(async (student_id) => {
                if (!shouldContinue) return;
                const findStudent = await User.findOne({ where: { user_id: +student_id, campus_id: +campus_id, status: true } });
                if (findStudent) {
                    await UserClassSemester.destroy({ where: { user_id: +student_id, class_id: +class_id } });
                    const getAllTeamInClass = await TeamService.getAllTeamInClass(req, res, next);
                    await Promise.all(getAllTeamInClass.findAllTeam.map(async (team) => {
                        if (!shouldContinue) return;
                        const teamId = team.dataValues.team_id;
                        const checkExistsStudentInTeam = await TeamUser.findOne({ where: { team_id: teamId, student_id: student_id } })
                        if (checkExistsStudentInTeam) {
                            await TeamUser.destroy({ where: { team_id: teamId, student_id: student_id } });
                            const countTeamUser = await TeamUser.count({ where: { team_id: teamId } });
                            await Team.update({ quantity: countTeamUser }, { where: { team_id: teamId, class_id: findClass.class_id } });
                            shouldContinue = false;
                        }
                    }));
                }
            }));
            const countStudentInClass = await UserClassSemester.count({ where: { class_id: class_id } });
            const quantity = `${countStudentInClass}/33`;
            await Class.update({ quantity: quantity }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
            return res.status(200).send({
                success: true,
                message: "Remove student successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async deleteOneClass(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const owner_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        as: "Owner",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });
            if (!findClass) throw new ErrorResponse(404, "Class not found")
            if (findClass.owner_id !== owner_id) throw new ErrorResponse(404, `Cannot be deleted, this Class was created by Lecturer '${findClass.Owner.email}'`)
            return await Class.destroy({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id, status: true } });
        } catch (error) {
            throw error;
        }

    }
    async settingDeadlineRequest(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const owner_id = req.user.id;
        const { deadline_request } = req.body;

        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        as: "Owner",
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            });
            if (!findClass) throw new ErrorResponse(404, "Class not found")
            if (findClass.owner_id !== owner_id) throw new ErrorResponse(404, `Cannot be deleted, this Class was created by Lecturer '${findClass.Owner.email}'`)
            return await Class.update({ deadline_request: deadline_request }, { where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
        } catch (error) {
            throw error;
        }
    }

    //Student
    async getMyClass(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findUserClassSemester = await UserClassSemester.findOne({
                where: { user_id: user_id, semester_id: semester_id },
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'campus_id', 'semester_id', 'quantity'],
                    }, {
                        model: User,
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    },
                ],
                attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
            });
            const getMyClass = await UserClassSemester.findAll({
                where: { class_id: findUserClassSemester.class_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    },
                ],
            })
            return getMyClass;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new ClassesService();