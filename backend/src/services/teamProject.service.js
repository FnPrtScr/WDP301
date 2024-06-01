const { User, Campus, Class, Project, Team, TeamUser, TeamProject, ColectureClass, Semester, UserClassSemester, FunctionRequirement, Notification, UserRoleSemester, sequelize } = require('../models')
const { Op, Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const NotificationService = require('../services/notification.service')
const fs = require('fs');
const templateData = fs.readFileSync('./src/utils/notification.json', 'utf8');
const templates = JSON.parse(templateData);
const { lowerCase, uppperCase } = require('../utils/format-string')

class TeamProjectService {

    // Lecture
    async getAllTeamProject(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            let { filter, page, limit, keyword } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const offset = (page - 1) * limit;

            const [lecturerClasses, coLecturerClasses] = await Promise.all([
                Class.findAll({
                    where: { user_id, campus_id, semester_id },
                    attributes: ['class_id']
                }),
                ColectureClass.findAll({
                    where: { colecture_id: user_id, campus_id, semester_id },
                    attributes: ['class_id']
                })
            ]);

            const classIds = lecturerClasses.map(info => info.class_id);
            const classIdsByCoLecturer = coLecturerClasses.map(info => info.class_id);

            const [teams, teamsByCoLecturer] = await Promise.all([
                Team.findAll({
                    where: { class_id: { [Op.in]: classIds } },
                    attributes: ['team_id']
                }),
                Team.findAll({
                    where: { class_id: { [Op.in]: classIdsByCoLecturer } },
                    attributes: ['team_id']
                })
            ]);

            const teamIds = teams.map(team => team.team_id);
            const teamIdsByCoLecturer = teamsByCoLecturer.map(team => team.team_id);

            const where = this.buildQueryGetAllTeamProject(teamIds, filter, uppperCase(keyword));
            const whereByCoLecturer = this.buildQueryGetAllTeamProject(teamIdsByCoLecturer, filter);

            const [teamProjectsLecturer, teamProjectsByCoLecturer] = await Promise.all([
                TeamProject.findAll({
                    where,
                    attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'link_jira', 'project_tracking', 'assigner_id'],
                    include: [
                        {
                            model: Team,
                            attributes: ['team_id', 'name'],
                            include: [
                                {
                                    model: Class,
                                    attributes: ['class_id', 'name']
                                }
                            ]
                        },
                        {
                            model: Project,
                            attributes: ['project_id', 'name']
                        },
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ],
                    offset,
                    limit,
                    order: [['createdAt', 'DESC']]
                }),
                TeamProject.findAll({
                    where: whereByCoLecturer,
                    attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'link_jira', 'project_tracking', 'assigner_id'],
                    include: [
                        {
                            model: Team,
                            attributes: ['team_id', 'name'],
                            include: [
                                {
                                    model: Class,
                                    attributes: ['class_id', 'name']
                                }
                            ],
                            required: false
                        },
                        {
                            model: Project,
                            attributes: ['project_id', 'name'],
                            required: false
                        },
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ],
                    required: false,
                    offset,
                    limit,
                    order: [['createdAt', 'DESC']]
                })
            ]);

            const allTeamProjects = teamProjectsLecturer.concat(teamProjectsByCoLecturer);

            return {
                teamProjects: allTeamProjects,
                total: allTeamProjects.length,
                totalPages: Math.ceil(allTeamProjects.length / limit),
            };
        } catch (error) {
            throw error;
        }
    }
    buildQueryGetAllTeamProject(teamIds, filter, keyword) {
        let where = {
            [Op.and]: [
                { team_id: { [Op.in]: teamIds } },
            ]
        };
        if (keyword) {
            where[Op.and].push({ '$Project.name$': { [Op.like]: `%${keyword}%` } })
        }
        if (filter) {
            where[Op.and].push({ class_id: +filter })
        }
        return where;
    }
    async assignProjectIntoTeam(req) {
        const { campus_id, semester_id } = req.params;
        const { teams_id, project_id, class_id } = req.body;
        const user_id = req.user.id;
        const t = await sequelize.transaction();
        let errors = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: user_id, type: 'lecturer_created', status: true } }, { transaction: t });
            if (!findProject) throw new ErrorResponse(404, "Project not found");

            await Promise.all(teams_id.map(async (team_id) => {
                let arrData = [];
                const findTeam = await Team.findOne({ where: { team_id: team_id, class_id: class_id, status: true } }, { transaction: t });
                if (!findTeam) {
                    errors.push(`Team with ID ${team_id} not found.`);
                    return;
                }
                const checkExistsTeamProject = await TeamProject.count({ where: { team_id: team_id, class_id: class_id, status: true } }, { transaction: t });
                if (checkExistsTeamProject > 0) {
                    errors.push(`Team with name ${findTeam.name} is already working on another project.`);
                    return;
                }
                const assignProject = await TeamProject.create({ team_id: team_id, class_id: class_id, project_id: project_id, assigner_id: user_id }, { transaction: t });
                if (!assignProject) {
                    errors.push(`Failed to assign project into team with name ${findTeam.name}.`);
                    return;
                }
                const getAllMemberInTeam = await TeamUser.findAll({ where: { team_id: team_id, class_id: class_id } });
                getAllMemberInTeam.map((studentId) => {
                    let obj = {
                        user_id: studentId.student_id,
                        content: templates['STUDENT']['ASSIGN']['PROJECT'].replace('{{projectName}}', findProject.name),
                        semester_id: semester_id,
                        campus_id: campus_id
                    }
                    arrData.push(obj);
                });
                // await Notification.bulkCreate(arrData, { transaction: t });
                await NotificationService.createManyNotification(arrData, { transaction: t });
            }));
            if (errors.length > 0) {
                throw new ErrorResponse(500, errors);
            }
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateTeamProject(req) {
        const { campus_id, semester_id, teamproject_id } = req.params;
        const { project_id } = req.body;
        const user_id = req.user.id
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findTeamProject = await TeamProject.findOne({ where: { teamproject_id: teamproject_id, assigner_id: user_id, status: true } })
            if (!findTeamProject) throw new ErrorResponse(404, "You are not allowed to update the project that the main instructor has assigned");
            await TeamProject.update({ project_id: project_id, assigner_id: user_id }, { where: { teamproject_id: teamproject_id, status: true } });
            return true;
        } catch (error) {
            throw error;
        }
    }
    async deleteTeamProject(req) {
        const { campus_id, semester_id, teamproject_id } = req.params;
        const user_id = req.user.id
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findTeamProject = await TeamProject.findOne({ where: { teamproject_id: teamproject_id, assigner_id: user_id, status: true } })
            if (!findTeamProject) throw new ErrorResponse(404, "You are not allowed to delete the project that the main instructor has assigned");
            await TeamProject.destroy({ where: { teamproject_id: teamproject_id, status: true } });
            return true;
        } catch (error) {
            throw error;
        }
    }
    async getProjectByTeamId(req) {
        const { campus_id, semester_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findProject = await TeamProject.findOne({
                where: { class_id: class_id, team_id: team_id },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken', 'assigner_id'],
                include: [
                    {
                        model: Team,
                        attributes: ["team_id"],
                        include: [
                            {
                                model: TeamUser,
                                attributes: ["student_id", "isLead"],
                                include: [
                                    {
                                        model: User,
                                        attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: Project,
                        attributes: ['project_id', 'name', 'description', 'file_path_requirement'],
                        include: [
                            {
                                model: FunctionRequirement,
                                attributes: ['functionrequirement_id', 'name', 'feature', 'LOC', 'complexity', 'description']
                            }
                        ]
                    },
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                    }
                ]
            });
            return findProject;
        } catch (error) {
            throw error;
        }
    }

    // Student
    async addLinkAndTechProject(req) {
        const { campus_id, semester_id, teamproject_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findTeamProject = await TeamProject.findOne({ where: { teamproject_id: teamproject_id, status: true } })
            if (!findTeamProject) throw new ErrorResponse(404, "TeamProject not found");
            const checkIsLead = await TeamUser.findOne({ where: { student_id: +user_id, team_id: +findTeamProject.team_id, isLead: true } });
            if (!checkIsLead) throw new ErrorResponse(404, "User not found in Team")
            if (checkIsLead && checkIsLead.isLead === false) throw new ErrorResponse(500, "You are not the team's leader");
            await TeamProject.update({ ...req.body }, { where: { teamproject_id: teamproject_id, status: true } });
            return true;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new TeamProjectService();