const { Op, Sequelize } = require('sequelize');
const { User, Campus, Team, TeamUser, Milestone, LOCEvaluation, Point, Iteration, ColectureClass, Project, TeamProject, FunctionRequirement, IterationSetting, Class, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
class LOCEvaluationService {
    // Lecturer
    async gradeForStudent(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { student_id, fcrqm_id, quality, graded_LOC, note } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                    user_id: user_id
                }
            })
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } });
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class")
            const getClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                }
            })
            const getIter = await Iteration.findOne({
                where: {
                    class_id: class_id,
                    owner_id: getClass.user_id,
                    iteration_id: iteration_id
                }
            })
            const findStudent = await UserClassSemester.findOne({ where: { user_id: student_id, class_id: class_id, semester_id: semester_id } });
            if (!findStudent) throw new ErrorResponse(404, "You have not taken any classes this semester");
            const findStudentInTeam = await TeamUser.findOne({ where: { team_id: team_id, student_id: student_id } });
            if (!findStudentInTeam) throw new ErrorResponse(404, "Student notFound in Team");
            const checkLimitLOC = await FunctionRequirement.findOne({ where: { functionrequirement_id: fcrqm_id } });
            if (graded_LOC > checkLimitLOC.LOC) throw new ErrorResponse(400, `The LOC you score must be less than or equal to ${checkLimitLOC.LOC}`);
            const [grade, created] = await LOCEvaluation.findOrCreate({
                where: {
                    fcrqm_id: fcrqm_id,
                    team_id: team_id,
                    class_id: class_id,
                },
                defaults: {
                    iteration_id: getIter.iteration_id,
                    fcrqm_id: fcrqm_id,
                    quality: quality,
                    student_id: student_id,
                    team_id: team_id,
                    class_id: class_id,
                    graded_LOC: graded_LOC,
                    lecture_id: user_id,
                    note: note,
                    status: true
                },
            })
            if (!created) {
                const findLOCE = await LOCEvaluation.findOne({
                    where: {
                        fcrqm_id: fcrqm_id,
                        team_id: team_id,
                        class_id: class_id
                    }
                })
                if (!findLOCE) throw new ErrorResponse(404, "An instructor has already graded this student, you cannot edit it")
                return await LOCEvaluation.update({
                    student_id: student_id,
                    graded_LOC: graded_LOC,
                    quality: quality,
                    note: note,
                    iteration_id: getIter.iteration_id,
                    lecture_id: grade.lecture_id,
                    status: true
                }, {
                    where: {
                        student_id: grade.student_id,
                        fcrqm_id: grade.fcrqm_id,
                        team_id: grade.team_id,
                        class_id: grade.class_id,
                    }
                })
            }
            return grade;
        } catch (error) {
            throw error;
        }
    }

    async getFunctionRequirementScoring(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        let result = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                    user_id: user_id
                }
            })
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } });
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class")
            const getProject = await TeamProject.findOne({
                where: { class_id: class_id, team_id: team_id },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken'],
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
                                attributes: ['functionrequirement_id', 'name', 'feature', 'LOC', 'complexity', 'description'],
                            }
                        ]
                    }
                ],
                order: [
                    [{ model: Project, as: 'Project' }, { model: FunctionRequirement, as: 'FunctionRequirements' }, 'functionrequirement_id', 'ASC']
                ]
            });

            const functionRequirementIds = getProject.Project.FunctionRequirements.map(funcReq => funcReq.functionrequirement_id);
            await LOCEvaluation.destroy({
                where: {
                    fcrqm_id: {
                        [Op.notIn]: functionRequirementIds
                    }
                },
            });
            await Promise.all(functionRequirementIds.map(async (funcReq) => {
                const locEvaluationData = {
                    // iteration_id: +iteration_id,
                    fcrqm_id: funcReq,
                    lecture_id: user_id,
                    team_id: team_id,
                    class_id: class_id
                };
                let [locEvaluationRecord, created] = await LOCEvaluation.findOrCreate({
                    // where: { fcrqm_id: funcReq, lecture_id: user_id, iteration_id: iteration_id, team_id: team_id },
                    where: {
                        fcrqm_id: funcReq,
                        // lecture_id: user_id, 
                        team_id: team_id,
                        class_id: class_id
                    },
                    defaults: locEvaluationData
                });
                const getLOCEvaluation = await LOCEvaluation.findOne({
                    where: {
                        locEvaluation_id: locEvaluationRecord.locEvaluation_id,
                        lecture_id: locEvaluationRecord.lecture_id,
                        // iteration_id: locEvaluationRecord.iteration_id,
                        iteration_id: null,
                        fcrqm_id: locEvaluationRecord.fcrqm_id,
                        team_id: locEvaluationRecord.team_id,
                        class_id: locEvaluationRecord.class_id,
                        status: false
                    },
                    attributes: ['locEvaluation_id', 'graded_LOC', 'iteration_id', 'fcrqm_id', 'quality', 'student_id', 'team_id', 'lecture_id', 'note', 'status'],
                    include: [
                        {
                            model: Team,
                            attributes: ['team_id', 'name'],
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
                            model: User,
                            as: 'Student',
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        },
                        {
                            model: FunctionRequirement,
                            attributes: ['functionrequirement_id', 'name', 'feature', 'LOC', 'complexity', 'description']
                        }
                    ]
                })
                if (getLOCEvaluation) {
                    result.push(getLOCEvaluation);
                }
            }))
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getFuntionRequirementGraded(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                    user_id: user_id
                }
            }, { transaction: t })
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } }, { transaction: t });
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class")
            const getClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                }
            })
            const getIter = await Iteration.findOne({
                where: {
                    class_id: class_id,
                    owner_id: getClass.user_id,
                    iteration_id: iteration_id
                }
            })
            const getLOCEvaluation = await LOCEvaluation.findAll({
                where: {
                    iteration_id: getIter.iteration_id,
                    team_id: team_id,
                    status: true
                },
                attributes: ['locEvaluation_id', 'graded_LOC', 'iteration_id', 'fcrqm_id', 'quality', 'student_id', 'team_id', 'lecture_id', 'note', 'status'],
                include: [
                    {
                        model: Team,
                        attributes: ['team_id', 'name'],
                    },
                    {
                        model: FunctionRequirement,
                        attributes: ['functionrequirement_id', 'name', 'feature', 'LOC', 'complexity', 'description']
                    },
                    {
                        model: User,
                        as: 'Student',
                        attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                    },
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                    },

                ],
                transaction: t
            })

            await t.commit();
            return getLOCEvaluation;
        } catch (error) {
            t.rollback();
            throw error;
        }
    }
    async checkConditionPresent(req) {
        const { campus_id, semester_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        const arrData = []
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                    user_id: user_id
                }
            })
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } });
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class")
            // const getClass = await Class.findOne({
            //     where: {
            //         class_id: class_id,
            //         semester_id: semester_id,
            //         campus_id: campus_id,
            //     }
            // })
            // const getAllIterationIds = await Iteration.findAll({
            //     where: {
            //         class_id: class_id,
            //         owner_id: getClass.user_id
            //     }
            // });
            const findTeam = await Team.findOne({
                where: {
                    team_id: team_id,
                    class_id: class_id
                },
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
            });
            if (!findTeam) throw new ErrorResponse(404, 'Team not found')
            const getAllStudentId = findTeam.TeamUsers.map(team => team.student_id)
            await Promise.all(getAllStudentId.map(async (student_id) => {
                const getPoint = await Point.findAll({
                    where: {
                        student_id: student_id,
                        semester_id: semester_id,
                        class_id: class_id,
                        team_id: team_id
                    },
                    include: [
                        {
                            model: Iteration,
                            attributes: ['iteration_id', 'name']
                        }
                    ]
                })
                arrData.push(getPoint);
            }))
            const filteredData = arrData.map(studentPoints =>
                studentPoints.filter(point => point.Iteration.name !== "Iteration 4")
            );
            const calculatedPoints = filteredData.map(studentPoints => {
                return studentPoints.reduce((acc, point) => {
                    const iterationMultiplier = {
                        "Iteration 1": 0.15,
                        "Iteration 2": 0.2,
                        "Iteration 3": 0.25
                    }[point.Iteration.name];
                    if (iterationMultiplier) {
                        acc[point.student_id] = acc[point.student_id] || 0;
                        acc[point.student_id] += point.graded_point * iterationMultiplier;
                    }
                    return acc;
                }, {});
            });

            // Tổng hợp điểm của từng sinh viên và chia cho 6
            const totalPoints = calculatedPoints.map(studentPoints => {
                const studentTotalPoints = {};
                Object.keys(studentPoints).forEach(student_id => {
                    studentTotalPoints[student_id] = +((studentPoints[student_id] || 0) / 6 * 10).toFixed(2);
                });
                return studentTotalPoints;
            });
            // Lấy ra id của sinh viên có điểm <= 5
            const filteredIds = totalPoints.filter(item => {
                const score = Object.values(item)[0];
                return score <= 5;
            }).map(item => +Object.keys(item)[0]);
            const studentsWithZeroPoints = [];
            // lấy các student có điểm iter 1,2,3 =0
            filteredData.forEach(studentPoints => {
                studentPoints.forEach(point => {
                    if (point.graded_point === 0 && (point.Iteration.name === "Iteration 1" || point.Iteration.name === "Iteration 2" || point.Iteration.name === "Iteration 3")) {
                        studentsWithZeroPoints.push(+point.student_id);
                    }
                });
            });
            const mergedData = studentsWithZeroPoints.concat(filteredIds.filter(item => !studentsWithZeroPoints.includes(item)));
            if (mergedData.length > 0) {
                await Promise.all(mergedData.map(async (item) => {
                    const who = await TeamUser.update({ status: false }, { where: { student_id: +item } })
                }))
            }
            return mergedData;
        } catch (error) {
            throw error;
        }
    }
    // async checkConditionPresent1(req) {
    //     const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
    //     const user_id = req.user.id;
    //     const arrData = []
    //     try {
    //         const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
    //         if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
    //         const findClass = await Class.findOne({
    //             where: {
    //                 class_id: class_id,
    //                 semester_id: semester_id,
    //                 campus_id: campus_id,
    //                 user_id: user_id
    //             }
    //         })
    //         const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } });
    //         if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class")
    //         const getClass = await Class.findOne({
    //             where: {
    //                 class_id: class_id,
    //                 semester_id: semester_id,
    //                 campus_id: campus_id,
    //             }
    //         })
    //         const getAllIterationIds = await Iteration.findAll({
    //             where: {
    //                 class_id: class_id,
    //                 owner_id: getClass.user_id
    //             }
    //         });
    //         await Promise.all(getAllIterationIds.map(async (iteration) => {
    //             const getAllLOCEvaluation = await LOCEvaluation.findAll({
    //                 where: {
    //                     iteration_id: iteration.iteration_id,
    //                     class_id: class_id,
    //                     team_id: team_id,
    //                     status: true
    //                 },
    //                 include: [
    //                     {
    //                         model: User,
    //                         as: 'Student',
    //                         attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
    //                     }
    //                 ]
    //             });
    //             const getMaxLOC = await Milestone.findOne({ where: { milestone_id: iteration.milestone_id } })
    //             const filteredResultsByTeamId = {};
    //             getAllLOCEvaluation.forEach((evaluation) => {
    //                 const teamId = evaluation.team_id;
    //                 if (!filteredResultsByTeamId[teamId]) {
    //                     filteredResultsByTeamId[teamId] = [];
    //                 }
    //                 filteredResultsByTeamId[teamId].push(evaluation);
    //             });
    //             const arrayOfEvaluationsByTeam = Object.values(filteredResultsByTeamId);
    //             arrayOfEvaluationsByTeam.forEach(async (evaluationsForTeam) => {
    //                 const sumGradedLOCWithStudentInfo = Object.values(evaluationsForTeam.reduce((acc, curr) => {
    //                     if (!acc[curr.student_id]) {
    //                         acc[curr.student_id] = {
    //                             student_id: curr.student_id,
    //                             totalLOC: 0,
    //                             student_info: curr.Student
    //                         };
    //                     }
    //                     acc[curr.student_id].totalLOC += curr.graded_LOC;
    //                     return acc;
    //                 }, {}));
    //                 const whos = sumGradedLOCWithStudentInfo.filter(sumL => +sumL.totalLOC >= +getMaxLOC.maxLOC || +sumL.totalLOC !== 0)
    //                 arrData.push(whos)
    //             });
    //         }))
    //         const totalLOCByEmail = {};

    //         arrData.forEach(dataset => {
    //             dataset.forEach(student => {
    //                 const userId = student.student_info.user_id;
    //                 const email = student.student_info.email;
    //                 const totalLOC = student.totalLOC;
    //                 if (!totalLOCByEmail[userId]) {
    //                     totalLOCByEmail[userId] = { totalLOC: 0, email: email, student_id: userId };
    //                 }
    //                 totalLOCByEmail[userId].totalLOC += totalLOC;
    //             });
    //         });
    //         const resultArray = Object.values(totalLOCByEmail);
    //         await Promise.all(resultArray.map(async (s) => {
    //             if (s.totalLOC < 1200) {
    //                 await TeamUser.update({ status: false }, {
    //                     where: {
    //                         student_id: s.student_id,
    //                         class_id: class_id,
    //                         team_id: team_id
    //                     }
    //                 });
    //             } else {
    //                 await TeamUser.update({ status: true }, {
    //                     where: {
    //                         student_id: s.student_id,
    //                         class_id: class_id,
    //                         team_id: team_id
    //                     }
    //                 });
    //             }
    //         }));
    //         return resultArray;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async getTotalLOC(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        let arrData = []
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                }
            })
            const getIter = await Iteration.findOne({
                where: {
                    class_id: class_id,
                    owner_id: getClass.user_id,
                    iteration_id: iteration_id
                }
            })
            const getAllLOCEvaluation = await LOCEvaluation.findAll({
                where: {
                    iteration_id: getIter.iteration_id,
                    class_id: class_id,
                    team_id: team_id,
                    status: true
                },
                include: [

                    {
                        model: User,
                        as: 'Student',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    },
                ]
            });
            const filteredResultsByTeamId = {};
            getAllLOCEvaluation.forEach((evaluation) => {
                const teamId = evaluation.team_id;
                if (!filteredResultsByTeamId[teamId]) {
                    filteredResultsByTeamId[teamId] = [];
                }
                filteredResultsByTeamId[teamId].push(evaluation);
            });
            const arrayOfEvaluationsByTeam = Object.values(filteredResultsByTeamId);
            arrayOfEvaluationsByTeam.forEach(async (evaluationsForTeam) => {
                const sumGradedLOCWithStudentInfo = Object.values(evaluationsForTeam.reduce((acc, curr) => {
                    if (!acc[curr.student_id]) {
                        acc[curr.student_id] = {
                            student_id: curr.student_id,
                            totalLOC: 0,
                            student_info: curr.Student,
                            status: curr.Team
                        };
                    }
                    acc[curr.student_id].totalLOC += curr.graded_LOC;
                    return acc;
                }, {}));
                arrData.push(sumGradedLOCWithStudentInfo)
            });
            const getTeamUser = await TeamUser.findAll({
                where: { class_id: class_id, team_id: team_id },
                attributes: ['student_id', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email']
                    }
                ]
            });
            arrData?.forEach(subArr => {
                subArr?.forEach(student => {
                    let match = getTeamUser?.find(item => item.student_id === student.student_id);
                    if (match) {
                        student.status = match.status;
                    }
                });
            });
            getTeamUser.forEach(student => {
                let found = arrData[0]?.find(item => item.student_id === student.student_id);
                if (!found) {
                    arrData[0]?.push({
                        student_id: student.student_id,
                        totalLOC: 0,
                        student_info: student.User,
                        status: student.status
                    });
                }
            });
            return arrData;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new LOCEvaluationService();