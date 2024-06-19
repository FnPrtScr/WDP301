const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, ColectureClass, Team, Project, TeamProject, TeamUser, ReviewerClass, Semester, UserClassSemester, Notification, UserRoleSemester, FunctionRequirement, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const RedisService = require('../services/redis.service');
const NotificationService = require('../services/notification.service');
const dayjs = require('dayjs')
const fs = require('fs');
const templateData = fs.readFileSync('./src/utils/notification.json', 'utf8');
const templates = JSON.parse(templateData);
const { lowerCase, uppperCase } = require('../utils/format-string')

class RequestService {
    // Lecturer
    async getRequest(req) {
        const { campus_id, semester_id } = req.params;
        const { status } = req.query;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working");
            const classes = await ColectureClass.findAll({ where: { colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } });
            const classIds = await classes.filter(classe => classe.class_id);
            let arrRequestCo = [];
            await Promise.all(classIds.map(async (classe) => {
                const lecturer = await Class.findOne({ where: { class_id: classe.class_id, campus_id: campus_id, semester_id: semester_id, status: true } });
                const keysCo = `${campus_id}:${semester_id}:student:request:project:${lecturer.user_id}:*`;
                const getKeysCo = await RedisService.keys({ ...req, body: { pattern: keysCo } });
                if (getKeysCo.length <= 0) [];
                let allHashesCo = [];
                await Promise.all(getKeysCo.map(async (keyCo) => {
                    const hashesCo = await RedisService.hgetall({ ...req, body: { key: keyCo } });
                    if (hashesCo.status.toLowerCase() === status.toLowerCase()) {
                        arrRequestCo.push(hashesCo);
                    }
                }));

            }))
            const arrCo = arrRequestCo.map(item => {
                return {
                    ...item,
                    classes: JSON.parse(item.classes),
                    functionReqs: JSON.parse(item.functionReqs),
                };
            });
            const keys = `${campus_id}:${semester_id}:student:request:project:${user_id}:*`;
            const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
            if (getKeys.length <= 0) [];
            let allHashes = [];

            await Promise.all(getKeys.map(async (key) => {
                const hashes = await RedisService.hgetall({ ...req, body: { key: key } });
                if (hashes.status.toLowerCase() === status.toLowerCase()) {
                    allHashes.push(hashes);
                }
            }));

            const parsedData = allHashes.map(item => {
                return {
                    ...item,
                    classes: JSON.parse(item.classes),
                    functionReqs: JSON.parse(item.functionReqs),
                };
            });

            return { parsedData, arrCo };
        } catch (error) {
            throw error;
        }
    }

    async acceptOrRejectRequest(req, res) {
        const { campus_id, semester_id } = req.params;
        const { key, status, note } = req.body;
        const user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findUser = await User.findOne({
                where: { user_id: user_id, campus_id: campus_id },
                attributes: ['email', 'code', 'avatar', 'first_name', 'last_name'],
            });
            // const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            // if (!findUser && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            req.body.key = key;
            const findRequestExists = await RedisService.hgetall(req);
            if (!findRequestExists) throw new ErrorResponse(400, "Request not found");
            const fields = {
                status: status ? "Approved" : "Rejected",
                note: note ? note : "",
                responseTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
            };
            let result;
            if (status === true) {
                const checkTeamProject = await TeamProject.findOne({ where: { team_id: findRequestExists.team_id } });
                if (checkTeamProject) {
                    let objNoti = {
                        user_id: +findRequestExists.student_id,
                        content: templates['STUDENT']['REQUEST']['PROJECT']["DUPLICATE"],
                        semester_id: semester_id,
                        campus_id: campus_id
                    }
                    await NotificationService.createNotification(objNoti)
                    throw new ErrorResponse(400, "This group already has a project")
                }
                const projectObj = {
                    name: findRequestExists.name,
                    description: findRequestExists.description,
                    file_path_requirement: findRequestExists.file_path_requirement,
                    type: findRequestExists.type,
                    owner_id: user_id,
                    team_id: findRequestExists.team_id,
                    semester_id: semester_id
                };
                const createProject = await Project.create(projectObj, { transaction: t });
                if (!createProject) {
                    throw new ErrorResponse(500, "Couldn't create project");
                }
                if (findRequestExists.functionReqs && JSON.parse(findRequestExists.functionReqs).length > 0) {
                    const arrDataFuncReq = JSON.parse(findRequestExists.functionReqs).map((functionReq) => ({
                        project_id: createProject.project_id,
                        feature: functionReq.feature,
                        description: functionReq.description,
                        LOC: functionReq.LOC,
                        name: functionReq.name,
                        complexity: functionReq.complexity
                    }));
                    const bulkCreateFuncReq = await FunctionRequirement.bulkCreate(arrDataFuncReq, { transaction: t });
                    if (bulkCreateFuncReq.length <= 0) {
                        throw new ErrorResponse(500, "Couldn't create function requirement");
                    }
                }
                result = await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                const classId = JSON.parse(findRequestExists.classes)
                const objTeamProject = {
                    team_id: findRequestExists.team_id,
                    class_id: classId.class_id,
                    project_id: createProject.project_id,
                    assigner_id: user_id
                }
                const createTeamProject = await TeamProject.create(objTeamProject, { transaction: t });
                if (!createTeamProject) throw new ErrorResponse(500, "Assign project failed")
                let objNoti = {
                    user_id: +findRequestExists.student_id,
                    content: templates['STUDENT']['REQUEST']['PROJECT']["APPROVED"].replace('{{lecturerName}}', findUser.email),
                    semester_id: semester_id,
                    campus_id: campus_id
                }
                // await Notification.create(objNoti);
                await NotificationService.createNotification(objNoti)
            } else {
                result = await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                let objNoti = {
                    user_id: +findRequestExists.student_id,
                    content: templates['STUDENT']['REQUEST']['PROJECT']["REJECTED"].replace('{{lecturerName}}', findUser.email),
                    semester_id: semester_id,
                    campus_id: campus_id
                }
                // await Notification.create(objNoti);
                await NotificationService.createNotification(objNoti)
            }
            await t.commit();
            return result;
        } catch (error) {
            t.rollback()
            throw error;
        }
    }

    // Student
    async createRequestProject(req, res, next) {
        const { campus_id, semester_id } = req.params;
        const { name, description } = req.body;
        const user_id = req.user.id;
        let arrFunctionRequirement = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findStudent = await UserClassSemester.findOne({
                where: { user_id: user_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        attributes: ['email']
                    },
                    {
                        model: Class,
                        attributes: ['class_id', 'name']
                    }
                ]
            });
            if (!findStudent) throw new ErrorResponse(404, "Student not found");
            const getLecturerId = await Class.findOne({ where: { class_id: findStudent.class_id, campus_id: campus_id, semester_id: semester_id } })
            const checkLeadInTeam = await TeamUser.findOne({
                where: { student_id: user_id, class_id: findStudent.class_id, isLead: true },
                include: [
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    }
                ]
            });
            if (!checkLeadInTeam) throw new ErrorResponse(404, "You are not the leader of the team");
            const checkTeamProject = await TeamProject.findOne({ where: { team_id: checkLeadInTeam.Team.team_id, class_id: findStudent.class_id } });
            if (checkTeamProject) throw new ErrorResponse(400, "Your group already has a project")
            // check thời gian hiện tại với thời gian deadline
            const key = `${campus_id}:${semester_id}:student:request:project:${getLecturerId.user_id}:${findStudent.Class.class_id}:${checkLeadInTeam.Team.team_id}:${Date.now()}`;
            const findRequestExists = await RedisService.hgetall({ ...req, body: { key: key } });
            if (findRequestExists && findRequestExists.status === "processing") throw new ErrorResponse(400, "Request has already");
            const classes = {
                class_id: getLecturerId.class_id,
                class_name: getLecturerId.name,
            }
            const fields = {
                key: key,
                student_id: user_id,
                team_id: checkLeadInTeam.Team.team_id,
                team_name: checkLeadInTeam.Team.name,
                classes: JSON.stringify(classes),
                name: name,
                description: description ? description : "",
                type: 'student_requested',
                file_path_requirement: req.files.pdfFile ? req.files.pdfFile[0].filename : "",
                note: "",
                status: "Processing",
                createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                responseTime: ""
            }
            const createReq = await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
            if (req.files && req.files.excelFile !== undefined) {
                const datas = await importDataExcel.fncImportFunctionRequirement(req, res, next);
                const objectsFromFourthIndex = datas.slice(4);
                await Promise.all(objectsFromFourthIndex.map(async (data) => {
                    let obj = {
                        name: data.__EMPTY_1,
                        feature: data.__EMPTY_2,
                        LOC: data.__EMPTY_3,
                        complexity: data.__EMPTY_4,
                        description: data.__EMPTY_5
                    }
                    arrFunctionRequirement.push(obj);
                }));
                if (arrFunctionRequirement.length > 0) {
                    const functionReqs = JSON.stringify(arrFunctionRequirement)
                    await RedisService.hmset({ ...req, body: { key: key, fields: { functionReqs } } });
                }
            }
            const objNoti = {
                user_id: getLecturerId.user_id,
                content: templates['LECTURER']['REQUEST']['PROJECT'].replace('{{teamName}}', checkLeadInTeam.Team.name).replace('{{className}}', findStudent.Class.name),
                semester_id: semester_id,
                campus_id: campus_id
            };
            // await Notification.create(objNoti);
            await NotificationService.createNotification(objNoti);
            return createReq;
        } catch (error) {
            throw error;
        }
    }

    async getRequestByStudent(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        const { status } = req.query;
        let allData = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findStudent = await UserClassSemester.findOne({
                where: { user_id: user_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        attributes: ['email']
                    },
                    {
                        model: Class,
                        attributes: ['class_id', 'name']
                    }
                ]
            });
            if (!findStudent) throw new ErrorResponse(404, "Student not found");
            const getLecturerId = await Class.findOne({ where: { class_id: findStudent.class_id, campus_id: campus_id, semester_id: semester_id } })
            const checkInTeam = await TeamUser.findOne({
                where: { student_id: user_id, class_id: findStudent.class_id },
                include: [
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    }
                ]
            });
            if (!checkInTeam) throw new ErrorResponse(404, "You are not the member of the team");
            const keys = `${campus_id}:${semester_id}:student:request:project:${getLecturerId.user_id}:${findStudent.Class.class_id}:${checkInTeam.Team.team_id}:*`;
            const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
            if (getKeys.length <= 0) return [];
            await Promise.all(getKeys.map(async (key) => {
                const getRequest = await RedisService.hgetall({ ...req, body: { key: key } })
                if (getRequest.status.toLowerCase() === status.toLowerCase()) {
                    allData.push({ ...getRequest, functionReqs: JSON.parse(getRequest.functionReqs) })
                }
            }))
            return allData ? allData : [];
        } catch (error) {
            throw error;
        }
    }

    async updateRequestProject(req, res, next) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        const { status } = req.query;
        let allData = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findStudent = await UserClassSemester.findOne({
                where: { user_id: user_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        attributes: ['email']
                    },
                    {
                        model: Class,
                        attributes: ['class_id', 'name']
                    }
                ]
            });
            if (!findStudent) throw new ErrorResponse(404, "Student not found");
        } catch (error) {
            throw error;
        }
    }


}
module.exports = new RequestService();