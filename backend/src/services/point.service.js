const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Project, Team, Point, PointResit, TeamUser, TeamProject, Feedback, Milestone, FinalEvaluation, ColectureClass, Iteration, LOCEvaluation, TeamEvaluation, IterationSetting, Semester, UserClassSemester, FunctionRequirement, Notification, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const RedisService = require('../services/redis.service');
const { lowerCase, uppperCase } = require('../utils/format-string');
class PointService {

    // Head
    async getTopTeamByClass(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        let arrData = [];
        try {
            const getPoint = await Point.findAll({
                where: {
                    semester_id: semester_id
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email'],
                    },
                    {
                        model: Iteration,
                        attributes: ['iteration_id', 'name']
                    },
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    },
                    {
                        model: Class,
                        attributes: ['class_id', 'name']
                    }
                ],
            })
            const studentPointsByIteration = new Map();

            getPoint.forEach(point => {
                let pointNew = 0
                const studentId = point.User.user_id;
                const studentEmail = point.User.email;
                const iterationName = point.Iteration.name;
                const gradedPoint = point.graded_point;
                const pointByLOC = point.point_by_LOC;
                if (gradedPoint && pointByLOC) {
                    pointNew = gradedPoint
                } else if (gradedPoint && !pointByLOC) {
                    pointNew = gradedPoint
                } else if (!gradedPoint && pointByLOC) {
                    pointNew = pointByLOC
                }
                const team = {
                    team_id: point.Team.team_id,
                    team_name: point.Team.name
                }
                const classes = {
                    class_id: point.Class.class_id,
                    class_name: point.Class.name
                }

                if (!studentPointsByIteration.has(studentId)) {
                    studentPointsByIteration.set(studentId, {
                        'Iteration 1': null,
                        'Iteration 2': null,
                        'Iteration 3': null,
                        'Iteration 4': null,
                        email: studentEmail,
                        team: team,
                        classes: classes
                    });
                }
                const iterationMap = studentPointsByIteration.get(studentId);
                iterationMap[iterationName] = pointNew;
            });
            studentPointsByIteration.forEach((iterationMap, studentId) => {
                const iteration1 = iterationMap['Iteration 1'] ? iterationMap['Iteration 1'] : 0;
                const iteration2 = iterationMap['Iteration 2'] ? iterationMap['Iteration 2'] : 0;
                const iteration3 = iterationMap['Iteration 3'] ? iterationMap['Iteration 3'] : 0;
                const iteration4 = iterationMap['Iteration 4'] ? iterationMap['Iteration 4'] : 0;
                const studentEmail = iterationMap.email;
                const team_id = iterationMap.team;
                const class_id = iterationMap.classes

                const avgFirstThree = (iteration1 * 0.15 + iteration2 * 0.2 + iteration3 * 0.25) / 0.6
                const weightedIteration4 = iteration4 * 0.4;
                const total = avgFirstThree + weightedIteration4;
                let obj = {
                    student: {
                        student_id: studentId,
                        email: studentEmail
                    },
                    team: team_id,
                    class: class_id,
                    iteration1: iteration1 ? iteration1 : 0,
                    iteration2: iteration2 ? iteration2 : 0,
                    iteration3: iteration3 ? iteration3 : 0,
                    iteration4: iteration4 ? iteration4 : 0,
                    totalFinal: +total.toFixed(2),
                }
                arrData.push(obj)
            });
            const classAverages = await this.calculateTeamAverages(arrData);

            const maxAverageTeams = await this.findMaxAverageTeams(classAverages);
            const result = Object.values(maxAverageTeams).flat();
            return result;
        } catch (error) {
            throw error;
        }
    }
    async calculateTeamAverages(data) {
        const classAverages = {};

        data.forEach(item => {
            const key = item.class.class_id;
            if (!classAverages[key]) {
                classAverages[key] = [];
            }
            let teamIndex = classAverages[key].findIndex(team => team.team_id === item.team.team_id);
            if (teamIndex === -1) {
                classAverages[key].push({ team_id: item.team.team_id, team: item.team, class: item.class, students: [], totalFinal: 0, count: 0 });
                teamIndex = classAverages[key].length - 1;
            }
            classAverages[key][teamIndex].students.push({
                student_id: item.student.student_id,
                email: item.student.email,
                iteration1: item.iteration1,
                iteration2: item.iteration2,
                iteration3: item.iteration3,
                iteration4: item.iteration4,
                totalFinal: item.totalFinal,
            });
            classAverages[key][teamIndex].class
            classAverages[key][teamIndex].totalFinal += item.totalFinal;
            classAverages[key][teamIndex].count++;
        });

        Object.keys(classAverages).forEach(classId => {
            classAverages[classId].forEach(team => {
                team.average = +(team.totalFinal / team.count).toFixed(2);
                delete team.totalFinal;
                delete team.count;
            });
        });

        return classAverages;
    }
    async findMaxAverageTeams(classAverages) {
        const maxAverageTeams = {};
        Object.keys(classAverages).forEach(classId => {
            const maxAverageTeam = classAverages[classId].reduce((maxTeam, currentTeam) => {
                return (maxTeam.average > currentTeam.average) ? maxTeam : currentTeam;
            });
            maxAverageTeams[classId] = maxAverageTeam;
        });
        return maxAverageTeams;
    }

    // Lecturer
    async gradePointAutoByTeam(iteration_id) {//iteration tron bảng iteration
        const t = await sequelize.transaction();
        try {
            const getIterationId = await Iteration.findOne({
                where: {
                    iteration_id: iteration_id
                }
            }, { transaction: t })
            const getMaxLOC = await Milestone.findOne({
                where: {
                    milestone_id: getIterationId.milestone_id
                }
            }, { transaction: t })
            const getAllLOCEvaluation = await LOCEvaluation.findAll({
                where: {
                    iteration_id: getIterationId.iteration_id,
                    status: true
                },
                include: [
                    {
                        model: User,
                        as: 'Student',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            }, { transaction: t });
            const filteredResultsByTeamId = {};

            // Nhóm kết quả theo team_id
            await getAllLOCEvaluation.forEach(async (evaluation) => {
                const teamId = evaluation.team_id;
                if (!filteredResultsByTeamId[teamId]) {
                    filteredResultsByTeamId[teamId] = [];
                }
                filteredResultsByTeamId[teamId].push(evaluation);
            });
            const arrayOfEvaluationsByTeam = Object.values(filteredResultsByTeamId);
            let arrDataPoint = [];
            await Promise.all(arrayOfEvaluationsByTeam.map(async (evaluationsForTeam) => {
                let team_id = evaluationsForTeam[0].team_id;
                let class_id = evaluationsForTeam[0].class_id;
                const sumGradedLOCWithStudentInfo = Object.values(evaluationsForTeam.reduce((acc, curr) => {
                    if (!acc[curr.student_id]) {
                        acc[curr.student_id] = {
                            student_id: curr.student_id,
                            totalLOC: 0,
                            student_info: curr.Student
                        };
                    }
                    acc[curr.student_id].totalLOC += curr.graded_LOC;
                    return acc;
                }, {}));
                const getTeamEvaluation = await TeamEvaluation.findOne({
                    where: {
                        iteration_id: getIterationId.iteration_id,
                        team_id: team_id,
                    }
                }, { transaction: t });

                const getSettingIter = await IterationSetting.findOne({
                    where: {
                        iteration_id: getIterationId.iteration_id,
                        status: true
                    }
                }, { transaction: t });

                if (!getSettingIter) throw new ErrorResponse(404, 'IterSetting not found');
                const getStudents = await TeamUser.findAll({
                    where: {
                        class_id: class_id,
                        team_id: team_id,
                    }
                });
                const studentIds = getStudents.map(student => student.student_id)
                const studentIds2 = sumGradedLOCWithStudentInfo.map(student => student.student_id)
                const pointSCandDB = getTeamEvaluation?.grade_SCandDB ? getTeamEvaluation?.grade_SCandDB : 0
                const pointSRS = getTeamEvaluation?.grade_SRS ? getTeamEvaluation?.grade_SRS : 0
                const pointSDS = getTeamEvaluation?.grade_SDS ? getTeamEvaluation?.grade_SDS : 0
                const pointDoc = (pointSRS + pointSDS) / 2
                await Promise.all(sumGradedLOCWithStudentInfo.map(async (grade) => {
                    let totalPointLOC = 0;
                    if (grade?.totalLOC >= getMaxLOC.maxLOC) {
                        totalPointLOC = getMaxLOC.maxLOC
                    } else {
                        totalPointLOC = grade?.totalLOC ? grade?.totalLOC : 0
                    }
                    const pointSourceAndDemo = +(pointSCandDB * (+getSettingIter.sourceanddemo / 100)).toFixed(2)
                    const pointDocument = +(pointDoc * (+getSettingIter.document / 100)).toFixed(2)
                    const pointProduct = +((totalPointLOC * (10 / getMaxLOC.maxLOC)) * (+getSettingIter.product / 100)).toFixed(2);
                    const students = await this.findDifferentElements(studentIds, studentIds2)
                    students.map(student => {
                        let obj = {
                            point_by_LOC: 0 + pointSourceAndDemo + pointDocument,
                            iteration_id: getIterationId.iteration_id,
                            student_id: student,
                            team_id: team_id,
                            class_id: class_id,
                            semester_id: getMaxLOC.semester_id
                        }
                        arrDataPoint.push(obj);
                    })
                    let obj = {
                        point_by_LOC: pointSourceAndDemo + pointDocument + pointProduct,
                        iteration_id: getIterationId.iteration_id,
                        student_id: grade.student_id,
                        team_id: team_id,
                        class_id: class_id,
                        semester_id: getMaxLOC.semester_id
                    };
                    arrDataPoint.push(obj);
                }));
            }));
            await Promise.all(arrDataPoint.map(async (dataPoint) => {
                const [graded, created] = await Point.findOrCreate({
                    where: {
                        student_id: dataPoint.student_id,
                        team_id: dataPoint.team_id,
                        class_id: dataPoint.class_id,
                        semester_id: dataPoint.semester_id,
                        iteration_id: dataPoint.iteration_id
                    },
                    defaults: {
                        point_by_LOC: dataPoint.point_by_LOC,
                        student_id: dataPoint.student_id,
                        team_id: dataPoint.team_id,
                        class_id: dataPoint.class_id,
                        semester_id: dataPoint.semester_id,
                        iteration_id: dataPoint.iteration_id
                    }
                })
                if (!created) {
                    return await Point.update({
                        point_by_LOC: dataPoint.point_by_LOC,
                    }, {
                        where: {
                            student_id: dataPoint.student_id,
                            team_id: dataPoint.team_id,
                            class_id: dataPoint.class_id,
                            semester_id: dataPoint.semester_id,
                            iteration_id: dataPoint.iteration_id
                        }
                    })
                }
            }))
            await t.commit();
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async findDifferentElements(array1, array2) {
        return array1.filter(item => !array2.includes(item))
            .concat(array2.filter(item => !array1.includes(item)));
    }
    async gradePointManualByStudent(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { student_id, graded_point, note } = req.body;
        const user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                }
            }, { transaction: t })
            const getIter = await Iteration.findOne({
                where: {
                    class_id: class_id,
                    owner_id: getClass.user_id,
                    iteration_id: iteration_id
                }
            }, { transaction: t })
            if (!getIter) throw new ErrorResponse(404, "Iteration not found");
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
            const findTeam = await Team.findOne({
                where: {
                    team_id: team_id,
                    class_id: class_id
                }
            }, { transaction: t });
            if (!findTeam) throw new ErrorResponse(404, 'Team not found')
            const findStudent = await UserClassSemester.findOne({
                where: {
                    user_id: student_id,
                    class_id: class_id,
                    semester_id: semester_id
                }
            }, { transaction: t });
            if (!findStudent) throw new ErrorResponse(404, 'Student not found');
            const [grade, created] = await Point.findOrCreate({
                where: {
                    student_id: student_id,
                    iteration_id: getIter.iteration_id,
                    semester_id: semester_id,
                    team_id: team_id,
                    class_id: class_id
                },
                defaults: {
                    graded_point: graded_point,
                    student_id: student_id,
                    iteration_id: getIter.iteration_id,
                    semester_id: semester_id,
                    team_id: team_id,
                    class_id: class_id,
                    note: note
                },
                transaction: t
            });
            if (!created) {
                const findPointGraded = await Point.findOne({
                    where: {
                        point_id: grade.point_id,
                        semester_id: semester_id,
                        iteration_id: getIter.iteration_id,
                        team_id: team_id,
                        class_id: class_id
                    }
                });
                if (!findPointGraded) throw new ErrorResponse(404, "An instructor has already graded this student, you cannot edit it");
                return await Point.update({
                    graded_point: graded_point,
                    note: note ?? ''
                }, {
                    where: {
                        student_id: student_id,
                        iteration_id: getIter.iteration_id,
                        semester_id: semester_id,
                        team_id: team_id,
                        class_id: class_id
                    }
                }, { transaction: t });
            }
            t.commit();
            return grade;
        } catch (error) {
            t.rollback();
            throw error;
        }
    }
    async getPointByTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        let arrData = [];
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
            const getClass = await Class.findOne({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            const findIter = await Iteration.findOne({
                where: {
                    iteration_id: +iteration_id,
                    owner_id: getClass.user_id
                }
            });
            if (!findIter) throw new ErrorResponse(404, "Iteration not found");
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
            await Promise.all(getAllStudentId.map(async (studentId) => {
                const getPoint = await Point.findOne({
                    where: {
                        iteration_id: iteration_id,
                        student_id: studentId,
                        semester_id: semester_id,
                        class_id: class_id,
                        team_id: team_id
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                })
                arrData.push(getPoint);
            }));
            return arrData;
        } catch (error) {
            throw error;
        }
    }
    async getPointByClass(req) {//id cuar milestone
        const { campus_id, semester_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const getClass = await Class.findOne({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id, status: true } })
            let { keyword, iteration, page, limit } = req.query;
            let where = await this.buildQuery(semester_id, iteration, keyword, getClass.user_id);
            // page = parseInt(page) || 1;
            // limit = parseInt(limit) || 10;
            // const offset = (page - 1) * limit;
            let order = [];
            if (req.query.sort) {
                const sort = req.query.sort
                order.push(sort.split(':'));
            }
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
            const getPointInClass = await Point.findAll({
                where: where,
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email'],
                    },
                    {
                        model: Iteration,
                        attributes: ['iteration_id', 'name']
                    },
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    }
                ],
                // offset: offset,
                // limit: limit,
                order: order
            })
            return getPointInClass;
        } catch (error) {
            throw error;
        }
    }
    async buildQuery(semester_id, iteration, keyword, user_id) {
        let where = {
            [Op.and]: [
                {
                    semester_id: semester_id
                },
                {
                    status: true
                }
            ]
        };
        if (iteration) {
            const getIteration = await Iteration.findOne({
                where: {
                    milestone_id: iteration,
                    owner_id: user_id
                }
            })
            where[Op.and].push({ iteration_id: getIteration.iteration_id })
        }
        if (keyword) {
            where[Op.and].push({ '$User.email$': { [Op.like]: `%${lowerCase(keyword)}%` } })
        }
        return where;
    }
    async gradePointIterationFinal(semester_id, iteration_id, class_id, team_id, getFinalEvaluation, type) {
        try {
            if (type === true) {
                let arrDataPoint = [];
                const filteredResultsByTeamId = {};
                const categoryPercentage = {
                    project_introduction: 0.1,
                    software_requirement: 0.2,
                    software_design: 0.2,
                    implementation: 0.4,
                    question_answer: 0.1
                }
                getFinalEvaluation.forEach((finalE) => {
                    if (!filteredResultsByTeamId[team_id]) {
                        filteredResultsByTeamId[team_id] = [];
                    }
                    filteredResultsByTeamId[team_id].push(finalE);
                });
                const arrayOfEvaluationsByTeam = Object.values(filteredResultsByTeamId);
                await Promise.all(arrayOfEvaluationsByTeam.map(async (evaluationsForTeam) => {
                    evaluationsForTeam.map((grade) => {
                        const pointProjectIntroduction = +(grade.project_introduction * categoryPercentage.project_introduction).toFixed(2);
                        const pointSoftwareRequirement = +(grade.software_requirement * categoryPercentage.software_requirement).toFixed(2);
                        const pointSoftwareDesign = +(grade.software_design * categoryPercentage.software_design).toFixed(2);
                        const pointImplementation = +(grade.implementation * categoryPercentage.implementation).toFixed(2);
                        const pointQuestionAnswer = +(grade.question_answer * categoryPercentage.question_answer).toFixed(2);
                        let obj = {
                            graded_point: pointProjectIntroduction + pointSoftwareRequirement + pointSoftwareDesign + pointImplementation + pointQuestionAnswer,
                            iteration_id: iteration_id,
                            student_id: grade.student_id,
                            team_id: team_id,
                            class_id: class_id,
                            semester_id: semester_id
                        }
                        arrDataPoint.push(obj);
                    })
                }))
                await Promise.all(arrDataPoint.map(async (dataPoint) => {
                    const [graded, created] = await Point.findOrCreate({
                        where: {
                            student_id: dataPoint.student_id,
                            team_id: dataPoint.team_id,
                            class_id: dataPoint.class_id,
                            semester_id: dataPoint.semester_id,
                            iteration_id: dataPoint.iteration_id
                        },
                        defaults: {
                            graded_point: dataPoint.graded_point,
                            student_id: dataPoint.student_id,
                            team_id: dataPoint.team_id,
                            class_id: dataPoint.class_id,
                            semester_id: dataPoint.semester_id,
                            iteration_id: dataPoint.iteration_id
                        }
                    })
                    if (!created) {
                        return await Point.update({
                            graded_point: dataPoint.graded_point,
                        }, {
                            where: {
                                student_id: dataPoint.student_id,
                                team_id: dataPoint.team_id,
                                class_id: dataPoint.class_id,
                                semester_id: dataPoint.semester_id,
                                iteration_id: dataPoint.iteration_id
                            }
                        })
                    }
                }))
            } else {
                let arrDataPoint = [];
                const filteredResultsByTeamId = {};
                const categoryPercentage = {
                    project_introduction: 0.1,
                    software_requirement: 0.2,
                    software_design: 0.2,
                    implementation: 0.4,
                    question_answer: 0.1
                }
                getFinalEvaluation.forEach((finalE) => {
                    if (!filteredResultsByTeamId[team_id]) {
                        filteredResultsByTeamId[team_id] = [];
                    }
                    filteredResultsByTeamId[team_id].push(finalE);
                });
                const arrayOfEvaluationsByTeam = Object.values(filteredResultsByTeamId);
                await Promise.all(arrayOfEvaluationsByTeam.map(async (evaluationsForTeam) => {
                    evaluationsForTeam.map((grade) => {
                        const pointProjectIntroduction = +(grade.project_introduction * categoryPercentage.project_introduction).toFixed(2);
                        const pointSoftwareRequirement = +(grade.software_requirement * categoryPercentage.software_requirement).toFixed(2);
                        const pointSoftwareDesign = +(grade.software_design * categoryPercentage.software_design).toFixed(2);
                        const pointImplementation = +(grade.implementation * categoryPercentage.implementation).toFixed(2);
                        const pointQuestionAnswer = +(grade.question_answer * categoryPercentage.question_answer).toFixed(2);
                        let obj = {
                            graded_pointrs: pointProjectIntroduction + pointSoftwareRequirement + pointSoftwareDesign + pointImplementation + pointQuestionAnswer,
                            iteration_id: iteration_id,
                            student_id: grade.student_id,
                            team_id: team_id,
                            class_id: class_id,
                            semester_id: semester_id
                        }
                        arrDataPoint.push(obj);
                    })
                }))
                await Promise.all(arrDataPoint.map(async (dataPoint) => {
                    const [graded, created] = await PointResit.findOrCreate({
                        where: {
                            student_id: dataPoint.student_id,
                            team_id: dataPoint.team_id,
                            class_id: dataPoint.class_id,
                            semester_id: dataPoint.semester_id,
                            iteration_id: dataPoint.iteration_id
                        },
                        defaults: {
                            graded_pointrs: dataPoint.graded_pointrs,
                            student_id: dataPoint.student_id,
                            team_id: dataPoint.team_id,
                            class_id: dataPoint.class_id,
                            semester_id: dataPoint.semester_id,
                            iteration_id: dataPoint.iteration_id
                        }
                    })
                    if (!created) {
                        return await PointResit.update({
                            graded_pointrs: dataPoint.graded_pointrs,
                        }, {
                            where: {
                                student_id: dataPoint.student_id,
                                team_id: dataPoint.team_id,
                                class_id: dataPoint.class_id,
                                semester_id: dataPoint.semester_id,
                                iteration_id: dataPoint.iteration_id
                            }
                        })
                    }
                }))
            }
        } catch (error) {
            throw error;
        }
    }


    // Student
    async getMyPoint(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await UserClassSemester.findOne({
                where: {
                    semester_id: semester_id,
                    user_id: user_id
                }
            });
            const getIterFinal = await Iteration.findOne({
                where: {
                    class_id: findClass.class_id,
                    name: {
                        [Op.like]: "%Iteration 4%"
                    }
                }
            })
            const getMyPoint = await Point.findAll({
                where: {
                    student_id: user_id,
                    semester_id: semester_id,
                    class_id: findClass.class_id,
                    iteration_id: {
                        [Op.ne]: getIterFinal.iteration_id
                    },
                    status: true,
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email']
                    },
                    {
                        model: Iteration,
                        attributes: ['iteration_id', 'name']
                    }
                ]
            })
            const getMyPointResit = await PointResit.findOne({
                where: {
                    student_id: user_id,
                    semester_id: +semester_id,
                    class_id: findClass.class_id,
                    iteration_id: getIterFinal.iteration_id,
                    status: true,
                }
            })
            const getPointIterFinal = await Point.findOne({
                where: {
                    student_id: user_id,
                    class_id: findClass.class_id,
                    iteration_id: getIterFinal.iteration_id,
                }
            });
            if (getPointIterFinal) {
                const pointIterFinal =getPointIterFinal.graded_point;
                return { getMyPoint,getMyPointResit, pointIterFinal }
            }
            return { getMyPoint };
        } catch (error) {
            throw error;
        }
    }

    async getMyPointByIteration(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await UserClassSemester.findOne({
                where: {
                    semester_id: semester_id,
                    user_id: user_id
                }
            });
            if (!findClass) throw new ErrorResponse(404, 'Class not found')
            const findTeamUser = await TeamUser.findOne({
                where: {
                    student_id: user_id,
                    class_id: findClass.class_id,
                }
            })
            if (!findTeamUser) throw new ErrorResponse(404, 'Team not found')
            const getIteration = await Iteration.findOne({
                where: {
                    iteration_id: iteration_id,
                }
            });
            if (getIteration.name === "Iteration 4") {
                const keys = `${campus_id}:${semester_id}:finalE:${findClass.class_id}:comments:*`
                const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
                if (getKeys.length <= 0) [];
                let arrComment = []
                await Promise.all(getKeys.map(async (key) => {
                    const getComment = await RedisService.hgetall({ ...req, body: { key: key } })
                    arrComment.push(getComment)
                }))
                const getMyPoint = await Point.findOne({ where: { student_id: user_id, iteration_id: iteration_id, semester_id: semester_id } });
                const getMyPointResit = await PointResit.findOne({ where: { student_id: user_id, iteration_id: iteration_id, semester_id: semester_id } });
                return { getMyPoint,getMyPointResit, arrComment }
            }
            const getMyLOC = await LOCEvaluation.findAll({
                where: { student_id: user_id, iteration_id: iteration_id, class_id: findClass.class_id },
                include: [
                    {
                        model: FunctionRequirement,
                    }
                ]
            })
            const getPointDoc = await TeamEvaluation.findOne({
                where: { team_id: findTeamUser.team_id, iteration_id: iteration_id, semester_id: semester_id },
                include: [
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    }
                ]
            })
            const getMyPoint = await Point.findOne({ where: { student_id: user_id, iteration_id: iteration_id, semester_id: semester_id } });
            const getMyPointResit = await PointResit.findOne({ where: { student_id: user_id, iteration_id: iteration_id, semester_id: semester_id } });
            return { getMyLOC, getMyPoint,getMyPointResit, getPointDoc }
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new PointService();