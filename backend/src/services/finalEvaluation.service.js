const { Op, Sequelize } = require('sequelize');
const { User, Campus, Team, TeamUser, Point, Milestone, ReviewerClass, FinalEvaluation, LOCEvaluation, Iteration, ColectureClass, Project, TeamProject, FunctionRequirement, IterationSetting, Class, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const RedisService = require('../services/redis.service');
const PointService = require('../services/point.service');
const dayjs = require('dayjs')
class FinalEvaluationService {
    // Reviewer
    async gradeFinal(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { datasStudents, comments, group_marks } = req.body;
        const user_id = req.user.id;
        const t = await sequelize.transaction();
        let arrData = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const checkGraded = await this.checkIteration123(class_id, team_id)
            if (!checkGraded) throw new ErrorResponse(400, "The instructor of this team has not finished grading iterations 1,2,3")
            const getLectureInClass = await Class.findOne({
                where: {
                    class_id: class_id,
                },
                attributes: ['class_id', 'user_id'],
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            })
            const getMilestone = await Milestone.findOne({
                where: {
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    semester_id: semester_id
                }
            })
            const checkIteration = await Iteration.findOne({
                where: {
                    milestone_id: getMilestone.milestone_id,
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    class_id: class_id,
                    owner_id: getLectureInClass.Lecture.user_id
                }
            })
            if (!checkIteration) throw new ErrorResponse(404, "Iteration not found")
            const reviewerInClass = await ReviewerClass.findAndCountAll({
                where: {
                    class_id: class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 1
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email'],
                    }
                ]
            });
            const isUserExist = reviewerInClass.rows.some(obj => obj.reviewer_id === user_id);
            if (!isUserExist) throw new ErrorResponse(404, "You are not a Reviewer of this group");
            const getReviewer = reviewerInClass.rows.filter(obj => obj.reviewer_id === user_id)
            // const key = `${campus_id}:${semester_id}:finalE:${checkIteration.iteration_id}:${class_id}:${team_id}:graded:${user_id}`;
            const key = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:graded:${user_id}`;
            if (req.body.datasStudents) {
                await Promise.all(datasStudents.map(async (data) => {
                    if (data.status === true) {
                        const findStudentInTeam = await TeamUser.findOne({
                            where: {
                                student_id: data.student_id,
                                team_id: +team_id,
                                class_id: +class_id
                            },
                            include: [
                                {
                                    model: User,
                                    attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                                }
                            ]
                        }, { transaction: t });
                        if (!findStudentInTeam) throw new ErrorResponse(404, "Student not found");
                        let obj = {
                            student_id: {
                                student_id: data.student_id,
                                email: findStudentInTeam.User.email,
                                status: data.status,
                            },
                            team_id: team_id,
                            iteration_id: +checkIteration.iteration_id,
                            project_introduction: data.project_introduction,
                            software_requirement: data.software_requirement,
                            software_design: data.software_design,
                            implementation: data.implementation,
                            question_answer: data.question_and_answer,
                            total: data.total
                        }
                        arrData.push(obj);
                    } else {
                        const findStudentInTeam = await TeamUser.findOne({
                            where: {
                                student_id: data.student_id,
                                team_id: +team_id,
                                class_id: +class_id
                            },
                            include: [
                                {
                                    model: User,
                                    attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                                }
                            ]
                        }, { transaction: t });
                        if (!findStudentInTeam) throw new ErrorResponse(404, "Student not found");
                        let obj = {
                            student_id: {
                                student_id: data.student_id,
                                email: findStudentInTeam.User.email,
                                status: data.status,
                            },
                            team_id: team_id,
                            iteration_id: +checkIteration.iteration_id,
                            project_introduction: 0,
                            software_requirement: 0,
                            software_design: 0,
                            implementation: 0,
                            question_answer: 0,
                            total: 0
                        }
                        arrData.push(obj);
                    }
                }));
                const fields = {
                    campus_id: campus_id,
                    semester_id: semester_id,
                    class_id: class_id,
                    team_id: team_id,
                    reviewer: getReviewer[0].User.email,
                    datas: JSON.stringify(arrData),
                    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }
                await RedisService.hmset({ ...req, body: { key: key, fields: fields } });

            }
            if (req.body.group_marks) {
                const getStudentInTeam = await TeamUser.findAll({
                    where: {
                        class_id: class_id,
                        team_id: team_id,
                    },
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                        }
                    ]
                }, { transaction: t });
                let arrGroupMarks = [];
                getStudentInTeam.map((student) => {
                    if (student.status === true) {
                        let obj = {
                            student_id: {
                                student_id: student.student_id,
                                email: student.User.email,
                                status: student.status,
                            },
                            team_id: team_id,
                            iteration_id: checkIteration.iteration_id,
                            project_introduction: group_marks.project_introduction,
                            software_requirement: group_marks.software_requirement,
                            software_design: group_marks.software_design,
                            implementation: group_marks.implementation,
                            question_answer: group_marks.question_and_answer,
                            total: group_marks.total
                        }
                        arrGroupMarks.push(obj);
                    } else {
                        let obj = {
                            student_id: {
                                student_id: student.student_id,
                                email: student.User.email,
                                status: student.status,
                            },
                            team_id: team_id,
                            iteration_id: checkIteration.iteration_id,
                            project_introduction: 0,
                            software_requirement: 0,
                            software_design: 0,
                            implementation: 0,
                            question_answer: 0,
                            total: 0
                        }
                        arrGroupMarks.push(obj);
                    }
                })
                const fields = {
                    campus_id: campus_id,
                    semester_id: semester_id,
                    class_id: class_id,
                    team_id: team_id,
                    reviewer: getReviewer[0].User.email,
                    datas: JSON.stringify(arrGroupMarks),
                    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }
                await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
            }
            if (req.body.comments) {
                // const key = `${campus_id}:${semester_id}:finalE:${checkIteration.iteration_id}:${class_id}:${team_id}:comments:${user_id}`;
                const key = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:comments:${user_id}`;
                const getHashed = await RedisService.hgetall({ ...req, body: { key: key } });
                if (!getHashed) {
                    const fields = {
                        campus_id: campus_id,
                        semester_id: semester_id,
                        iteration_id: checkIteration.iteration_id,
                        class_id: class_id,
                        team_id: team_id,
                        reviewer: getReviewer[0].User.email,
                        project_introduction: comments.project_introduction ? comments.project_introduction : "",
                        software_requirement: comments.software_requirement ? comments.software_requirement : "",
                        software_design: comments.software_design ? comments.software_design : "",
                        implementation: comments.implementation ? comments.implementation : "",
                        question_and_answer: comments.question_and_answer ? comments.question_and_answer : "",
                        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    }
                    await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                } else {
                    const fields = {
                        campus_id: campus_id,
                        semester_id: semester_id,
                        iteration_id: checkIteration.iteration_id,
                        class_id: class_id,
                        team_id: team_id,
                        reviewer: getReviewer[0].User.email,
                        project_introduction: comments.project_introduction ? comments.project_introduction : "",
                        software_requirement: comments.software_requirement ? comments.software_requirement : "",
                        software_design: comments.software_design ? comments.software_design : "",
                        implementation: comments.implementation ? comments.implementation : "",
                        question_and_answer: comments.question_and_answer ? comments.question_and_answer : "",
                        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    }
                    await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                }
            }
            // const keysGrade = `${campus_id}:${semester_id}:finalE:${checkIteration.iteration_id}:${class_id}:${team_id}:graded:*`
            const keysGrade = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:graded:*`
            const getKeysGraded = await RedisService.keys({ ...req, body: { pattern: keysGrade } });
            const totalScores = {};
            const totalScoresFalses = {};
            if (+reviewerInClass.count === +getKeysGraded.length) {
                await Promise.all(getKeysGraded.map(async (key) => {
                    const getGradedE = await RedisService.hgetall({ ...req, body: { key: key } });
                    const dataKey = { ...getGradedE, datas: JSON.parse(getGradedE.datas) }
                    dataKey.datas.forEach(item => {
                        if (item.student_id.status === true) {
                            const studentId = item.student_id.student_id;
                            Object.keys(item).forEach(key => {
                                if (key !== "student_id") {
                                    if (!totalScores[studentId]) {
                                        totalScores[studentId] = {};
                                    }
                                    if (!totalScores[studentId][key]) {
                                        totalScores[studentId][key] = 0;
                                    }
                                    totalScores[studentId][key] += item[key];
                                }
                            });
                            Object.keys(item).forEach(key => {
                                if (key !== "student_id") {
                                    if (!totalScoresFalses[studentId]) {
                                        totalScoresFalses[studentId] = {};
                                    }
                                    if (!totalScoresFalses[studentId][key]) {
                                        totalScoresFalses[studentId][key] = 0;
                                    }
                                    totalScoresFalses[studentId][key] += item[key];
                                }
                            });
                        } else {
                            const studentId = item.student_id.student_id;
                            Object.keys(item).forEach(key => {
                                if (key !== "student_id") {
                                    if (!totalScoresFalses[studentId]) {
                                        totalScoresFalses[studentId] = {};
                                    }
                                    if (!totalScoresFalses[studentId][key]) {
                                        totalScoresFalses[studentId][key] = 0;
                                    }
                                    totalScoresFalses[studentId][key] += item[key];
                                }
                            });
                        }
                    });
                }));
                const averageScores = {};
                Object.keys(totalScores).forEach(studentId => {
                    averageScores[studentId] = {};
                    ["project_introduction", "software_requirement", "software_design", "implementation", "question_answer", 'total'].forEach(key => {
                        averageScores[studentId][key] = totalScores[studentId][key] / +reviewerInClass.count;
                    });
                });
                const averageScoresFalse = {};
                Object.keys(totalScoresFalses).forEach(studentId => {
                    averageScoresFalse[studentId] = {};
                    ["project_introduction", "software_requirement", "software_design", "implementation", "question_answer", 'total'].forEach(key => {
                        averageScoresFalse[studentId][key] = totalScoresFalses[studentId][key] / +reviewerInClass.count;
                    });
                });
                const finalArray = Object.keys(averageScores).map(studentId => ({
                    student_id: parseInt(studentId),
                    team_id: +team_id,
                    class_id: +class_id,
                    iteration_id: checkIteration.iteration_id,
                    xnd_review: 1,
                    ...averageScores[studentId]
                }));
                const finalArrayAll = Object.keys(averageScoresFalse).map(studentId => ({
                    student_id: parseInt(studentId),
                    team_id: +team_id,
                    class_id: +class_id,
                    iteration_id: checkIteration.iteration_id,
                    xnd_review: 1,
                    ...averageScoresFalse[studentId]
                }));
                const finalResits = finalArray.filter(final => final.total < 5)
                await FinalEvaluation.destroy({ where: { team_id: team_id, class_id: class_id, iteration_id: checkIteration.iteration_id, xnd_review: 1 } }, { transaction: t })
                const getFinalEvaluation = await FinalEvaluation.bulkCreate(finalArrayAll, { transaction: t });
                await PointService.gradePointIterationFinal(+semester_id, +checkIteration.iteration_id, +class_id, +team_id, getFinalEvaluation, true)
                await Promise.all(finalResits.map(async (finalResit) => {
                    let keyResit = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:getFinalResit:${finalResit.student_id}`
                    let fields = {
                        student_id: finalResit.student_id,
                        team_id: finalResit.team_id,
                        class_id: finalResit.class_id,
                        iteration_id: finalResit.iteration_id
                    }
                    await RedisService.hmset({ ...req, body: { key: keyResit, fields: fields } });
                }))
            }
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async checkIteration123(class_id, team_id) {
        const getMembers = await TeamUser.findAll({
            where: {
                team_id: team_id,
                class_id: class_id,
            }
        });
        const count = getMembers.length;

        if (count * 3 > 0) {
            const findAllPointIter123 = await Point.findAll({
                where: {
                    team_id: team_id,
                    class_id: class_id
                }
            });
            if (findAllPointIter123.length < count * 3) {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    async getFinalGraded(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")

            const checkLectureInClass = await Class.findOne({
                where: {
                    user_id: user_id,
                    class_id: class_id
                }
            })
            const checkReviewerClass = await ReviewerClass.findOne({
                where: {
                    class_id: class_id,
                    campus_id: campus_id,
                    semester_id: semester_id,
                    reviewer_id: user_id,
                    xnd_review: 1
                }
            });
            if (!checkLectureInClass && !checkReviewerClass) throw new ErrorResponse(404, "You are not a Lecturer or Reviewer of this class")
            const getLectureInClass = await Class.findOne({
                where: {
                    class_id: class_id,
                },
                attributes: ['class_id', 'user_id'],
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            })
            const getMilestone = await Milestone.findOne({
                where: {
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    semester_id: semester_id
                }
            })
            const checkIteration = await Iteration.findOne({
                where: {
                    milestone_id: getMilestone.milestone_id,
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    owner_id: getLectureInClass.Lecture.user_id

                }
            })
            if (!checkIteration) throw new ErrorResponse(404, "Iteration not found")
            const keysGrade = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:graded:*`
            const getKeysGraded = await RedisService.keys({ ...req, body: { pattern: keysGrade } });
            const keysComment = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:comments:*`
            const getKeysCommentE = await RedisService.keys({ ...req, body: { pattern: keysComment } });
            let arrDataGraded = [];
            let arrComment = [];
            await Promise.all(getKeysGraded.map(async (keyGraded) => {
                const getGradedE = await RedisService.hgetall({ ...req, body: { key: keyGraded } });
                arrDataGraded.push({ reviewer: getGradedE.reviewer, datas: JSON.parse(getGradedE.datas) })
            }))
            await Promise.all(getKeysCommentE.map(async (keyComment) => {
                const getCommentE = await RedisService.hgetall({ ...req, body: { key: keyComment } });
                arrComment.push({
                    reviewer: getCommentE.reviewer,
                    project_introduction: getCommentE.project_introduction,
                    software_requirement: getCommentE.software_requirement,
                    software_design: getCommentE.software_design,
                    implementation: getCommentE.implementation,
                    question_answer: getCommentE.question_and_answer
                });
            }))
            const outputRedis = await this.processDataInRedis(arrDataGraded, arrComment)
            const getGradedInSystem = await FinalEvaluation.findAll({
                where: {
                    team_id: team_id,
                    xnd_review: 1
                },
                attributes: ['project_introduction', 'software_requirement', 'software_design', 'implementation', 'question_answer'],
                include: [
                    {
                        model: User,
                        as: 'Student',
                        attributes: ['user_id', 'email'],
                    }
                ]
            });
            const result = getGradedInSystem.map(item => {
                const { Student, ...grades } = item.dataValues;
                const student_id = {
                    student_id: Student.user_id,
                    email: Student.email
                };
                return { student_id, ...grades };
            });

            const getGradedOutSystem = await this.processDataInSystem(result)
            return { allGraded: outputRedis, getGradedFinalEInSystem: getGradedOutSystem };
        } catch (error) {
            throw error;
        }
    }
    async getFinalGradedResit(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")

            const checkLectureInClass = await Class.findOne({
                where: {
                    user_id: user_id,
                    class_id: class_id
                }
            })
            const checkReviewerClass = await ReviewerClass.findOne({
                where: {
                    class_id: class_id,
                    campus_id: campus_id,
                    semester_id: semester_id,
                    reviewer_id: user_id,
                    xnd_review: 2
                }
            });
            if (!checkLectureInClass && !checkReviewerClass) throw new ErrorResponse(404, "You are not a Lecturer or Reviewer of this class")
            const getLectureInClass = await Class.findOne({
                where: {
                    class_id: class_id,
                },
                attributes: ['class_id', 'user_id'],
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            })
            const getMilestone = await Milestone.findOne({
                where: {
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    semester_id: semester_id
                }
            })
            const checkIteration = await Iteration.findOne({
                where: {
                    milestone_id: getMilestone.milestone_id,
                    class_id: class_id,
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    owner_id: getLectureInClass.Lecture.user_id

                }
            })
            if (!checkIteration) throw new ErrorResponse(404, "Iteration not found")
            const keysGrade = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:graded:*`
            const getKeysGraded = await RedisService.keys({ ...req, body: { pattern: keysGrade } });
            const keysComment = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:comments:*`
            const getKeysCommentE = await RedisService.keys({ ...req, body: { pattern: keysComment } });
            let arrDataGraded = [];
            let arrComment = [];
            await Promise.all(getKeysGraded.map(async (keyGraded) => {
                const getGradedE = await RedisService.hgetall({ ...req, body: { key: keyGraded } });
                arrDataGraded.push({ reviewer: getGradedE.reviewer, datas: JSON.parse(getGradedE.datas) })
            }))
            await Promise.all(getKeysCommentE.map(async (keyComment) => {
                const getCommentE = await RedisService.hgetall({ ...req, body: { key: keyComment } });
                arrComment.push({
                    reviewer: getCommentE.reviewer,
                    project_introduction: getCommentE.project_introduction,
                    software_requirement: getCommentE.software_requirement,
                    software_design: getCommentE.software_design,
                    implementation: getCommentE.implementation,
                    question_answer: getCommentE.question_and_answer
                });
            }))
            const outputRedis = await this.processDataInRedis(arrDataGraded, arrComment)
            const getGradedInSystem = await FinalEvaluation.findAll({
                where: {
                    team_id: team_id,
                    xnd_review: 2
                },
                attributes: ['project_introduction', 'software_requirement', 'software_design', 'implementation', 'question_answer'],
                include: [
                    {
                        model: User,
                        as: 'Student',
                        attributes: ['user_id', 'email'],
                    }
                ]
            });
            const result = getGradedInSystem.map(item => {
                const { Student, ...grades } = item.dataValues;
                const student_id = {
                    student_id: Student.user_id,
                    email: Student.email
                };
                return { student_id, ...grades };
            });

            const getGradedOutSystem = await this.processDataInSystem(result)
            return { allGraded: outputRedis, getGradedFinalEInSystem: getGradedOutSystem };
        } catch (error) {
            throw error;
        }
    }
    async processDataInRedis(arrDataGraded, arrComment) {
        const output = [];
        arrDataGraded.forEach((item) => {
            const reviewer = item.reviewer;
            const datas = [];
            const categories = [
                "project_introduction",
                "software_requirement",
                "software_design",
                "implementation",
                "question_answer",
                "total",
            ];
            categories.forEach((category) => {
                const newData = {};
                const categoryData = {};
                item.datas.forEach((data) => {
                    categoryData[data.student_id.email] = data[category];
                });
                newData[category] = {
                    "ClassName/Group": category.replace("_", " ").toUpperCase(),
                    ...categoryData,
                };
                const comment = arrComment.find(
                    (comment) => comment.reviewer === reviewer,
                );
                if (comment && comment[category]) {
                    newData[category]["Comment"] = comment[category];
                } else {
                    newData[category]["Comment"] = null;
                }
                datas.push(newData);
            });
            output.push({ reviewer, datas });
        });
        return output;
    }
    async processDataInSystem(datas) {
        const output = [];
        const tempObj = {};
        datas.forEach(item => {
            Object.entries(item).forEach(([key, value]) => {
                if (typeof value === 'number' && key !== 'iteration_id') {
                    if (!tempObj[key]) {
                        tempObj[key] = {};
                    }
                    tempObj[key]["ClassName/Group"] = key.replace("_", " ").toUpperCase();
                    tempObj[key][item.student_id.email] = value;
                }
            });
        });

        Object.entries(tempObj).forEach(([key, value]) => {
            const newObj = {};
            newObj[key] = value;
            output.push(newObj);
        });
        return output;
    }
    async gradeFinalResit(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { datasStudents, comments } = req.body;
        const user_id = req.user.id;
        let arrData = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getLectureInClass = await Class.findOne({
                where: {
                    class_id: class_id,
                    semester_id: semester_id,
                    campus_id: campus_id,
                },
                attributes: ['class_id', 'user_id'],
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            })
            const getMilestone = await Milestone.findOne({
                where: {
                    name: {
                        [Op.like]: "Iteration 4"
                    },
                    semester_id: semester_id
                }
            })
            const checkIteration = await Iteration.findOne({
                where: {
                    milestone_id: getMilestone.milestone_id,
                    name: {
                        [Op.like]: "%Iteration 4%"
                    },
                    class_id: class_id,
                    owner_id: getLectureInClass.user_id

                }
            })
            if (!checkIteration) throw new ErrorResponse(404, "Iteration not found")
            const reviewerInClass = await ReviewerClass.findAndCountAll({
                where: {
                    class_id: class_id, semester_id: semester_id, campus_id: campus_id, xnd_review: 2
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email'],
                    }
                ]
            });
            const isUserExist = reviewerInClass.rows.some(obj => obj.reviewer_id === user_id);
            if (!isUserExist) throw new ErrorResponse(404, "You are not a Reviewer of this group");
            const getReviewer = reviewerInClass.rows.filter(obj => obj.reviewer_id === user_id)
            const key = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:graded:${user_id}`;
            if (datasStudents.length > 0) {
                await Promise.all(datasStudents.map(async (data) => {
                    const findStudentInTeam = await TeamUser.findOne({
                        where: {
                            student_id: data.student_id,
                            team_id: +team_id,
                            class_id: +class_id
                        },
                        include: [
                            {
                                model: User,
                                attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                            }
                        ]
                    });
                    if (!findStudentInTeam) throw new ErrorResponse(404, "Student not found");
                    let obj = {
                        student_id: {
                            student_id: data.student_id,
                            email: findStudentInTeam.User.email
                        },
                        team_id: team_id,
                        iteration_id: +checkIteration.iteration_id,
                        project_introduction: data.project_introduction,
                        software_requirement: data.software_requirement,
                        software_design: data.software_design,
                        implementation: data.implementation,
                        question_answer: data.question_and_answer,
                        total: data.total
                    }
                    arrData.push(obj);
                }));
                const fields = {
                    campus_id: campus_id,
                    semester_id: semester_id,
                    class_id: class_id,
                    team_id: team_id,
                    reviewer: getReviewer[0].User.email,
                    datas: JSON.stringify(arrData),
                    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                }
                await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
            }
            if (req.body.comments) {
                const key = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:comments:${user_id}`;
                const getHashed = await RedisService.hgetall({ ...req, body: { key: key } });
                if (!getHashed) {
                    const fields = {
                        campus_id: campus_id,
                        semester_id: semester_id,
                        iteration_id: checkIteration.iteration_id,
                        class_id: class_id,
                        team_id: team_id,
                        reviewer: getReviewer[0].User.email,
                        project_introduction: comments.project_introduction ? comments.project_introduction : "",
                        software_requirement: comments.software_requirement ? comments.software_requirement : "",
                        software_design: comments.software_design ? comments.software_design : "",
                        implementation: comments.implementation ? comments.implementation : "",
                        question_and_answer: comments.question_and_answer ? comments.question_and_answer : "",
                        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    }
                    await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                } else {
                    const fields = {
                        campus_id: campus_id,
                        semester_id: semester_id,
                        iteration_id: checkIteration.iteration_id,
                        class_id: class_id,
                        team_id: team_id,
                        reviewer: getReviewer[0].User.email,
                        project_introduction: comments.project_introduction ? comments.project_introduction : "",
                        software_requirement: comments.software_requirement ? comments.software_requirement : "",
                        software_design: comments.software_design ? comments.software_design : "",
                        implementation: comments.implementation ? comments.implementation : "",
                        question_and_answer: comments.question_and_answer ? comments.question_and_answer : "",
                        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                        updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    }
                    await RedisService.hmset({ ...req, body: { key: key, fields: fields } });
                }
            }
            const keysGrade = `${campus_id}:${semester_id}:finalResit:${class_id}:${team_id}:graded:*`
            const getKeysGraded = await RedisService.keys({ ...req, body: { pattern: keysGrade } });
            const totalScores = {};
            if (+reviewerInClass.count === +getKeysGraded.length) {
                await Promise.all(getKeysGraded.map(async (key) => {
                    const getGradedE = await RedisService.hgetall({ ...req, body: { key: key } });
                    const dataKey = { ...getGradedE, datas: JSON.parse(getGradedE.datas) }
                    dataKey.datas.forEach(item => {
                        const studentId = item.student_id.student_id;
                        Object.keys(item).forEach(key => {
                            if (key !== "student_id") {
                                if (!totalScores[studentId]) {
                                    totalScores[studentId] = {};
                                }
                                if (!totalScores[studentId][key]) {
                                    totalScores[studentId][key] = 0;
                                }
                                totalScores[studentId][key] += item[key];
                            }
                        });
                    });
                }));
                const averageScores = {};
                Object.keys(totalScores).forEach(studentId => {
                    averageScores[studentId] = {};
                    ["project_introduction", "software_requirement", "software_design", "implementation", "question_answer", 'total'].forEach(key => {
                        averageScores[studentId][key] = totalScores[studentId][key] / +reviewerInClass.count;
                    });
                });
                const finalArray = Object.keys(averageScores).map(studentId => ({
                    student_id: parseInt(studentId),
                    team_id: +team_id,
                    class_id: +class_id,
                    iteration_id: checkIteration.iteration_id,
                    xnd_review: 2,
                    ...averageScores[studentId]
                }));
                await FinalEvaluation.destroy({ where: { team_id: team_id, class_id: class_id, iteration_id: checkIteration.iteration_id, xnd_review: 2 } })
                const getFinalEvaluation = await FinalEvaluation.bulkCreate(finalArray);
                await PointService.gradePointIterationFinal(+semester_id, +checkIteration.iteration_id, +class_id, +team_id, getFinalEvaluation, false)
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new FinalEvaluationService();