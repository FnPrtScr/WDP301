const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Team, Project, TeamProject, TeamUser, ReviewerClass, Semester, UserClassSemester, UserRoleSemester, FunctionRequirement, TeamIterationDocument, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const TeamService = require('../services/team.service');
const { lowerCase, uppperCase } = require('../utils/format-string')

class ProjectService {

    // LECTURER
    async createOne(req, res, next) {
        const { campus_id, semester_id } = req.params;
        const { name, description } = req.body;
        const user_id = req.user.id;
        let arrFunctionRequirement = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProject = await Project.findOne({ where: { owner_id: user_id, name: uppperCase(name), type: 'lecturer_created' } })
            if (findProject) return res.status(400).send({ message: "Project already exists" });
            const createProject = await Project.create({
                owner_id: user_id,
                file_path_requirement: req.files.pdfFile ? req.files.pdfFile[0].filename : null,
                name: uppperCase(name),
                description: description ? description : null,
                type: 'lecturer_created',
                semester_id: semester_id
            });
            if (!createProject) return res.status(500).send({ message: "Create project failed" });
            if (req.files && req.files.excelFile !== undefined) {
                const datas = await importDataExcel.fncImportFunctionRequirement(req, res, next);
                const objectsFromFourthIndex = datas.slice(4);
                await Promise.all(objectsFromFourthIndex.map(async (data) => {
                    let obj = {
                        project_id: createProject.project_id,
                        name: data.__EMPTY_1,
                        feature: data.__EMPTY_2,
                        LOC: data.__EMPTY_3,
                        complexity: data.__EMPTY_4,
                        description: data.__EMPTY_5
                    }
                    arrFunctionRequirement.push(obj);
                }));
                await FunctionRequirement.bulkCreate(arrFunctionRequirement);
            }
            return res.status(200).send({
                success: true,
                message: "Project created successfully",
                data: createProject
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getAllMyProject(req, res) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            let { keyword } = req.query;
            const team_id = null;
            const type = 'lecturer_created'
            let where = this.buildQueryMyProject(uppperCase(keyword), team_id, type, user_id);
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProjects = await Project.findAll({
                where: where,
            });
            return res.status(200).send(findProjects);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    buildQueryMyProject(keyword, team_id, type, user_id) {
        let where = {
            [Op.and]: [
                {
                    owner_id: user_id
                },
                {
                    team_id: team_id
                },
                {
                    type: type
                },
            ]
        };
        if (keyword) {
            where[Op.and].push({ name: { [Op.like]: `%${keyword}%` } })
        }
        return where;
    }
    async deleteOne(req, res) {
        const { campus_id, semester_id, project_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: user_id, type: 'lecturer_created' } });
            if (!findProject) return res.status(404).send({ message: "Project not found" });
            await Project.destroy({ where: { project_id: project_id, owner_id: user_id } })
            return res.status(200).send({
                success: true,
                message: "Delete project succeeded",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async updateOne(req, res, next) {
        const { campus_id, semester_id, project_id } = req.params;
        const { name } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: user_id, type: 'lecturer_created' } });
            if (!findProject) throw new ErrorResponse(404, "Project not found");
            const checkExistProject = await Project.findOne({ where: { name: uppperCase(name), owner_id: { [Op.ne]: user_id }, type: 'lecturer_created' } })
            if (checkExistProject) throw new ErrorResponse(400, "Project has already");
            return await Project.update({
                name: uppperCase(name),
                ...req.body
            }, {
                where: {
                    project_id: project_id,
                    owner_id: user_id
                }
            })
        } catch (error) {
            throw error;
        }
    }
    async getAllProjectForRequestTopic(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findProject = await Project.findAll({ where: { owner_id: user_id, semester_id: semester_id, type: 'student_requested' } });
            return findProject;
        } catch (error) {
            throw error;
        }
    }


    // REVIEWER
    async getAllReviewProject(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const user_id = req.user.id;
        let { keyword, page, limit, filter } = req.query;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            let where = this.buildQueryGetAllReviewProject(user_id, campus_id, semester_id, keyword, filter);
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;
            const findAllReviewProject = await ReviewerClass.findAll({
                where: where,
                attributes: ['reviewerclasses_id', 'class_id', 'reviewer_id', 'semester_id', 'campus_id', 'createdAt'],
                include: [
                    {
                        model: Class,
                        attributes: ['class_id', 'name', 'user_id', 'quantity', 'createdAt'],
                        include: [
                            {
                                model: Team,
                                attributes: ['team_id', 'class_id', 'name', 'quantity'],
                                include: [
                                    {
                                        model: TeamUser,
                                        // where: { status: true },
                                        attributes: ['team_id', 'student_id', 'class_id','status'],
                                        include: [
                                            {
                                                model: User,
                                                attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                                            }
                                        ],
                                        required: false
                                    },
                                    {
                                        model: TeamProject,
                                        attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken'],
                                        include: [
                                            {
                                                model: Project,
                                                attributes: ['project_id', 'name', 'file_path_requirement', 'description']
                                            }
                                        ]
                                    },
                                    {
                                        model: TeamIterationDocument,
                                        attributes: ['path_file_doc', 'url_doc', 'path_file_final_present', 'iteration_id', 'team_id']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                offset: offset,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });
            return findAllReviewProject;
        } catch (error) {
            throw error;
        }
    }
    buildQueryGetAllReviewProject(user_id, campus_id, semester_id, keyword, filter) {
        let where = {
            [Op.and]: [
                {
                    reviewer_id: user_id
                },
                {
                    campus_id: campus_id
                },
                {
                    semester_id: semester_id
                }, {
                    xnd_review: 1
                }
            ]

        };
        if (keyword) {
            where[Op.and].push({ '$Class.name$': { [Op.like]: `%${uppperCase(keyword)}%` } });
        }
        if (filter) {
            where[Op.and].push({ class_id: +filter })
        }
        return where;
    }

    // STUDENT
    async getMyProject(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const userClass = await UserClassSemester.findOne({
                where: {
                    user_id: user_id,
                    semester_id: semester_id
                },
                include: [
                    {
                        model: Class,
                        where: {
                            campus_id: campus_id,
                            semester_id: semester_id
                        }
                    }
                ]
            });
            if (!userClass) throw new ErrorResponse(404, "User is not attending class this semester");
            const userTeam = await TeamUser.findOne({
                where: {
                    student_id: user_id
                },
                include: [{
                    model: Team,
                    where: {
                        class_id: userClass.class_id
                    }
                }]
            });
            if (!userTeam) throw new ErrorResponse(404, "User does not join any team in this class");
            const project = await TeamProject.findOne({
                where: {
                    team_id: userTeam.team_id
                },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken'],
                include: [
                    {
                        model: Project,
                        attributes: ['project_id', 'name', 'file_path_requirement', 'description']
                    }, {
                        model: Team,
                        attributes: ['class_id', 'name', 'quantity']
                    }
                ]
            });
            if (!project) throw new ErrorResponse(404, "Your group has not chosen any project yet")
            return project;
        } catch (error) {
            throw error;
        }
    }
    async getAllProjectFromMyLecturer(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getClass = await UserClassSemester.findOne({ where: { user_id: user_id, semester_id: semester_id, status: true } });
            if (!getClass) throw new ErrorResponse(404, "Class not found");
            const getMyLecturer = await Class.findOne({ where: { class_id: getClass.class_id, campus_id: campus_id, semester_id: semester_id, status: true } });
            if (!getMyLecturer) throw new ErrorResponse(404, "Lecturer not found");
            const getAllProjectFromMyLecturer = await Project.findAll({ where: { owner_id: getMyLecturer.user_id, type: 'lecturer_created' } });
            return getAllProjectFromMyLecturer;
        } catch (error) {
            throw error;
        }
    }


}
module.exports = new ProjectService();