const { User, Campus, Class, Project, Team, TeamUser, Semester, Iteration, UserClassSemester, UserRoleSemester, TeamIterationDocument, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');



class TeamIterationDocService {

    //Lecturer
    async getAllDocumentByIter(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const user_id = req.user.id;
        let arrDocs = [];
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const getAllClass = await Class.findAll({
                where: {
                    user_id: user_id,
                    semester_id: semester_id,
                    campus_id: campus_id
                },
                include: [
                    {
                        model: Team,
                        attributes: ['team_id']
                    }
                ]
            })

            const teamIds = getAllClass.flatMap(item => item.Teams.map(team => team.team_id));

            await Promise.all(teamIds.map(async (teamId) => {
                const getDoc = await TeamIterationDocument.findOne({
                    where: {
                        team_id: teamId,
                        iteration_id: iteration_id
                    },
                    attributes: ['tid_id', 'path_file_doc', 'url_doc', 'path_file_final_present', 'iteration_id', 'team_id'],
                    include: [
                        {
                            model: Team,
                            attributes: ['name'],
                            include: [
                                {
                                    model: Class,
                                    attributes: ['class_id', 'name']
                                }
                            ]
                        }
                    ]
                })
                arrDocs.push(getDoc);
            }))
            return arrDocs;
        } catch (error) {
            throw error;
        }
    }
    async getDocumentByTeamID(req) {
        const { campus_id, semester_id, iteration_id, team_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const findTeam = await Team.findOne({ where: { team_id: team_id } });
            if (!findTeam) throw new ErrorResponse(404, 'Team not found');
            const getDoc = await TeamIterationDocument.findOne({
                where: {
                    team_id: team_id,
                    iteration_id: iteration_id
                },
                attributes: ['tid_id', 'path_file_doc', 'url_doc', 'path_file_final_present', 'iteration_id', 'team_id'],
                include: [
                    {
                        model: Team,
                        attributes: ['name'],
                        include: [
                            {
                                model: Class,
                                attributes: ['class_id', 'name']
                            }
                        ]
                    }
                ]
            })
            if (!getDoc) throw new ErrorResponse(404, 'This group has not submitted documents for this iteration')
            return getDoc;
        } catch (error) {
            throw error;
        }
    }


    //Student
    async submitDocument(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const { url_doc, path_file_final_present } = req.body;
        const user_id = req.user.id;
        
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const findUser = await UserClassSemester.findOne({ where: { user_id: user_id, semester_id: semester_id } });
            if (!findUser) throw new ErrorResponse(404, "You have not taken any classes this semester")
            const checkLead = await TeamUser.findOne({ where: { student_id: user_id, class_id: findUser.class_id } });
            if (!checkLead.isLead) throw new ErrorResponse(404, "You are not the leader of this team");
            const getDeadline = await Iteration.findOne({
                where: {
                    iteration_id: iteration_id,
                }
            });
            const currentDateTime = dayjs().add(7,'hour');
            const startDateTime = dayjs(getDeadline.startDate)
            const endDateTime = dayjs(getDeadline.endDate);
            if (currentDateTime.isAfter(startDateTime) && currentDateTime.isBefore(endDateTime)) {
                const [teamIterDoc, created] = await TeamIterationDocument.findOrCreate({
                    where: {
                        team_id: checkLead.team_id,
                        iteration_id: iteration_id
                    },
                    defaults: {
                        path_file_doc: req.file ? req.file.filename : null,
                        url_doc: url_doc ? url_doc : null,
                        path_file_final_present: path_file_final_present ? path_file_final_present : null,
                        iteration_id: iteration_id
                    }
                });
                if (!created) {
                    return await TeamIterationDocument.update({
                        path_file_doc: req.file ? req.file.filename : null,
                        url_doc: url_doc ? url_doc : null,
                        path_file_final_present: path_file_final_present ? path_file_final_present : null,
                    }, {
                        where: {
                            team_id: checkLead.team_id,
                            iteration_id: iteration_id
                        }
                    })
                }
                return teamIterDoc;
            } else {
                throw new ErrorResponse(400, "You are submitting documents outside of the deadline period.");
            }
        } catch (error) {
            throw error;
        }
    }
    reverseDateString(dateString) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            return "Invalid date format";
        }
    }
    checkDeadline(currentTime, startDate, endDate) {
        const currentTimeObj = dayjs(currentTime);
        const startDateObj = dayjs(startDate);
        const endDateObj = dayjs(endDate);
        return (
            !currentTimeObj.isBefore(startDateObj) &&
            currentTimeObj.isBefore(endDateObj)
        );
    }

    async getDocumentMyTeam(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
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
            const getDocMyTeam = await TeamIterationDocument.findOne({
                where: {
                    iteration_id: iteration_id,
                    team_id: userTeam.team_id
                }
            })
            return getDocMyTeam;
        } catch (error) {
            throw error;
        }
    }



}
module.exports = new TeamIterationDocService();