const { User, Campus, Class, Project, Team, TeamUser, Semester, UserClassSemester, ColectureClass, UserRoleSemester, sequelize } = require('../models')
const { Op, Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const moment = require("moment");
const { lowerCase, uppperCase } = require('../utils/format-string')

class TeamService {

    async getAllTeamInClass(req, res, next) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const findAllTeam = await Team.findAll({
                where: { class_id: class_id },
                include: [
                    {
                        model: TeamUser,
                        attributes: ['team_id', 'isLead'],
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                            }
                        ]
                    }
                ],
                order: [
                    [
                        Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                    ]
                ]
            });
            const studentsInClass = await UserClassSemester.findAll({
                where: { class_id: class_id, semester_id: semester_id },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                    }
                ],
                attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
            });
            const studentsWithGroup = await TeamUser.findAll({
                include: [{
                    model: Team,
                    where: { class_id: class_id },
                    attributes: []
                }],
                attributes: ['student_id']
            });
            const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
            const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
            return { studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam };
        } catch (error) {
            throw error;
        }
    }

    async createOne(req, res) {
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findClass = await Class.findOne({ where: { class_id: class_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) return res.status(404).send({ message: "Class not found or you are not a Lecturer or CoLecturer of this Class" });

            const findTeams = await Team.findAll({ where: { class_id: class_id } });
            const maxNumber = findTeams.length === 0 ? 0 : Math.max(...findTeams.map(item => parseInt(item.name.split(" ")[1])));
            let name = `Group ${findTeams.length === 0 ? 1 : maxNumber + 1}`;
            const createTeam = await Team.create({ name: name.trim().toUpperCase(), class_id: class_id, quantity: 0, owner_id: user_id });

            if (!createTeam) return res.status(500).send({ message: "Create team failed" });

            return res.status(200).send({
                success: true,
                message: "Create team successfully",
                data: createTeam
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async addOneStudentIntoTeam(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const { student_ids, team_id } = req.body;
        const user_id = req.user.id
        let arrDataResult = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, semester_id: semester_id, campus_id: campus_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const findTeam = await Team.findOne({ where: { team_id: team_id, class_id: class_id } });
            if (!findTeam) throw new ErrorResponse(404, "Team not found!");
            await Promise.all(student_ids.map(async (student_id) => {
                const findStudentInClass = await UserClassSemester.findOne({ where: { user_id: student_id, class_id: class_id } })
                if (!findStudentInClass) throw new ErrorResponse(404, "You have not taken any classes this semester");
                const addIntoTeam = await TeamUser.create({ team_id: team_id, student_id: student_id, class_id: class_id, isLead: false });
                arrDataResult.push(addIntoTeam);
            }));
            const countMember = await TeamUser.count({ where: { team_id: team_id, class_id: class_id } });
            await Team.update({ quantity: countMember }, { where: { team_id: team_id, class_id: class_id } });
            return arrDataResult;
        } catch (error) {
            throw error;
        }
    }
    async randomTeam(req, res) {
        const { campus_id, semester_id, class_id } = req.params;
        const { not } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) return res.status(404).send({ message: "Class not found or you are not a Lecturer or CoLecturer of this Class" });

            const getAllStudentInClass = await UserClassSemester.findAll({
                where: { class_id: class_id },
                include: [{
                    model: User,
                    atributes: ['email', 'first_name', 'last_name']
                }]
            });

            const result = await this.divisionDataTeam(getAllStudentInClass, not);


            const formattedResult = result.map((team, index) => {
                const leadIndex = Math.floor(Math.random() * team.length);
                return {
                    Group: index + 1,
                    TeamSize: team.length,
                    Students: team.map((obj, studentIndex) => ({
                        user_id: obj.user_id,
                        email: obj.User.email,
                        first_name: obj.User.first_name,
                        last_name: obj.User.last_name,
                        isLead: studentIndex === leadIndex
                    })),
                };
            });
            await Promise.all(formattedResult.map(async (rs) => {
                let arrDataCreateTeamUser = [];
                let name = `GROUP ${rs.Group}`;
                const findTeam = await Team.findOne({ where: { name: name, class_id: +class_id } });
                if (findTeam) return false;
                let obj = {
                    class_id: class_id,
                    name: name,
                    quantity: rs.TeamSize,
                    owner_id: user_id
                };
                const createTeam = await Team.create(obj);
                if (createTeam) {
                    await Promise.all(rs.Students.map(async (student) => {
                        let objTeamUser = {
                            team_id: createTeam.team_id,
                            isLead: student.isLead,
                            student_id: student.user_id,
                            class_id: class_id
                        };
                        arrDataCreateTeamUser.push(objTeamUser);
                    }));
                    await TeamUser.bulkCreate(arrDataCreateTeamUser);
                }
            }));
            const getTeamInClass = await Team.findAll({
                where: { class_id: +class_id },
                include: [
                    {
                        model: TeamUser,
                        include: [
                            {
                                model: User,
                                attributes: ['email', 'code', 'first_name', 'last_name', 'avatar']
                            }
                        ],
                        attributes: ['teamuser_id', 'student_id', 'isLead'],

                    }
                ],
                attributes: ['team_id', 'name', 'quantity']
            });

            return res.status(200).send({
                success: true,
                message: 'Team created successfully',
                data: getTeamInClass
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async divisionDataTeam(arrDataStudent, not) {
        let team = [];
        for (let i = 0; i < not; i++) {
            team.push([]);
        }
        while (arrDataStudent.length > 0) {
            for (let i = 0; i < team.length && arrDataStudent.length > 0; i++) {
                let randomIndex = Math.floor(Math.random() * arrDataStudent.length);
                team[i].push(arrDataStudent[randomIndex]);
                arrDataStudent.splice(randomIndex, 1);
            }
        }
        return team;
    }

    async setLeaderInTeam(req) {
        const { campus_id, semester_id, class_id, team_id } = req.params;
        const { student_id } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const findTeam = await Team.findOne({ where: { team_id: team_id, class_id: class_id } });
            if (!findTeam) throw new ErrorResponse(404, "Team not found");
            const findStudent = await UserClassSemester.findOne({ where: { user_id: student_id, class_id: class_id, semester_id: semester_id } });
            if (!findStudent) throw new ErrorResponse(404, "Student not found");
            const checkLeadInTeam = await TeamUser.findOne({ where: { team_id: team_id, class_id: class_id, isLead: true } });
            if (checkLeadInTeam) {
                await TeamUser.update({ isLead: false }, { where: { team_id: team_id, student_id: checkLeadInTeam.student_id, class_id: class_id } });
                return await TeamUser.update({ isLead: true }, { where: { team_id: team_id, student_id: student_id, class_id: class_id } });
            }
            return await TeamUser.update({ isLead: true }, { where: { team_id: team_id, student_id: student_id, class_id: class_id } });
        } catch (error) {
            throw error;
        }
    }

    async moveStudentIntoOtherTeam(req, res) {
        const { campus_id, semester_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        const { student_id, new_team_id } = req.body;
        try {
            await sequelize.transaction(async (t) => {
                const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
                if (!checkSemesterActive) return res.status(404).json({
                    success: false,
                    message: "This semester is not working"
                });
                const findClass = await Class.findOne({ where: { class_id, user_id }, transaction: t });
                const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
                if (!findClass && !findColectureClass) return res.status(404).send({ message: "Class not found or you are not a Lecturer or CoLecturer of this Class" });

                const findStudentInOldTeam = await TeamUser.findOne({ where: { student_id, team_id, class_id }, transaction: t });
                if (!findStudentInOldTeam) return res.status(404).send({ message: "Student not found in Team" });

                if (findStudentInOldTeam.isLead) {
                    const getAllMembersInGroup = await TeamUser.findAll({ where: { team_id, class_id }, transaction: t });
                    const randomMember = getAllMembersInGroup[Math.floor(Math.random() * getAllMembersInGroup.length)];
                    await TeamUser.update({ isLead: true }, { where: { student_id: randomMember.student_id, team_id, class_id: class_id }, transaction: t });
                    await TeamUser.update({ isLead: false }, { where: { student_id, team_id, class_id: class_id }, transaction: t });
                }

                await TeamUser.update({ team_id: new_team_id }, { where: { student_id, team_id, class_id: class_id }, transaction: t });

                const [countTeamUserInOldTeam, countTeamUserInNewTeam] = await Promise.all([
                    TeamUser.count({ where: { team_id, class_id: class_id }, transaction: t }),
                    TeamUser.count({ where: { team_id: new_team_id, class_id: class_id }, transaction: t })
                ]);

                await Promise.all([
                    Team.update({ quantity: countTeamUserInOldTeam }, { where: { team_id, class_id }, transaction: t }),
                    Team.update({ quantity: countTeamUserInNewTeam }, { where: { team_id: new_team_id, class_id }, transaction: t })
                ]);
            });

            return res.status(200).send({ success: true, message: "Move student successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async removeMemberOutGroup(req) {
        const { campus_id, semester_id, class_id, team_id, student_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: class_id, user_id: user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const checkOwner = await Team.findOne({
                where: {
                    team_id: team_id,
                }
            });
            if (checkOwner.owner_id !== user_id && !findClass && findColectureClass) {
                if (findColectureClass) {
                    throw new ErrorResponse(404, `Team ${checkOwner.name} was created by the main instructor, so you do not have the right to delete it`)
                }
            }
            const findStudent = await TeamUser.findOne({ where: { student_id: student_id, team_id: team_id, class_id: class_id } });
            if (!findStudent) throw new ErrorResponse(404, "Student not found in Team");
            if (findStudent.isLead === true) {
                const getAllMembersInGroup = await TeamUser.findAll({ where: { team_id: team_id, class_id: class_id } });
                const randomMember = getAllMembersInGroup[Math.floor(Math.random() * getAllMembersInGroup.length)];
                await TeamUser.update({ isLead: true }, { where: { student_id: randomMember.student_id, team_id: team_id, class_id: class_id } });
                await TeamUser.update({ isLead: false }, { where: { student_id: student_id, team_id: team_id, class_id: class_id } });
            }
            await TeamUser.destroy({ where: { student_id: student_id, team_id: team_id, class_id: class_id, status: true } })
            const countTeamMemberInGroup = await TeamUser.count({ where: { team_id: team_id, class_id: class_id } });
            await Team.update({ quantity: countTeamMemberInGroup }, { where: { team_id: team_id, class_id: class_id } })
            return true;
        } catch (error) {
            throw error;
        }
    }

    async removeTeamInClass(req) {
        const { campus_id, semester_id, class_id } = req.params;
        const { teams_id } = req.body;
        const user_id = req.user.id;
        let errors = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: +class_id, user_id: +user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            await Promise.all(teams_id.map(async (team_id) => {
                const checkOwner = await Team.findOne({
                    where: {
                        team_id: team_id,
                    }
                });
                if (checkOwner.owner_id !== user_id && !findClass && findColectureClass) {
                    if (findColectureClass) {
                        errors.push(`${checkOwner.name} was created by the main instructor, so you do not have the right to delete it`)
                        return
                    }
                }
            }));
            if (errors.length > 0) {
                throw new ErrorResponse(500, errors);
            }
            await Team.destroy({ where: { team_id: teams_id, class_id: class_id } })
            await this.updateNameTeam(class_id)
            return true;
        } catch (error) {
            throw error;
        }
    }
    async updateNameTeam(class_id) {
        const getAllTeam = await Team.findAll({ where: { class_id: +class_id } });
        for (let i = 0; i < getAllTeam.length; i++) {
            await Team.update(
                { name: `GROUP ${i + 1}` },
                { where: { team_id: getAllTeam[i].team_id, class_id: class_id } }
            );
        }
    }
    // Student
    async getMyTeam(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const userClass = await UserClassSemester.findOne({
                where: { semester_id, user_id, status: true },
                attributes: ['class_id']
            });
            if (!userClass) throw new ErrorResponse(404, "Class not found");
            const userTeam = await TeamUser.findOne({
                where: {
                    class_id: userClass.class_id,
                    student_id: user_id
                },
                attributes: ['team_id', 'class_id']
            });
            if (!userTeam) throw new ErrorResponse(404, "Team not found");
            const teamMembers = await TeamUser.findAll({
                where: {
                    team_id: userTeam.team_id,
                    class_id: userTeam.class_id
                },
                attributes: ["student_id", "isLead"],
                include: [{
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }]
            });

            return teamMembers;
        } catch (error) {
            throw error;
        }
    }



}
module.exports = new TeamService();