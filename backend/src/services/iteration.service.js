const { User, Campus, Milestone, Iteration, IterationSetting, Class, Semester, UserClassSemester, ColectureClass, UserRoleSemester, sequelize } = require('../models')
const { ErrorResponse } = require('../utils/response');
const moment = require("moment");

class IterationService {

    //Lecturer
    async setDeadlineForIteration(req) {
        const { campus_id, semester_id, milestone_id, class_id } = req.params;
        const { startDate, endDate } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working");
            const findClass = await Class.findOne({ where: { class_id: +class_id, user_id: +user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: +class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const checkMyClass = await Class.findOne({ where: { class_id: +class_id, campus_id: campus_id, semester_id: semester_id } })
            const findMilestone = await Milestone.findOne({ where: { milestone_id: milestone_id, semester_id: semester_id } })
            if (!findMilestone) throw new ErrorResponse(404, 'Milestone not found');
            if (checkMyClass.user_id !== user_id) {
                const [findOrCreateIteration, created] = await Iteration.findOrCreate(
                    {
                        where: { milestone_id: findMilestone.milestone_id, owner_id: checkMyClass.user_id, class_id: class_id },
                        defaults: {
                            milestone_id: milestone_id,
                            name: findMilestone.name,
                            startDate: startDate,
                            endDate: endDate,
                            owner_id: checkMyClass.user_id,
                            class_id: class_id
                        }
                    }
                )
                if (!created) {
                    const setDeadlineAgain = await Iteration.update(
                        { startDate: startDate, endDate: endDate, status: true },
                        {
                            where: { iteration_id: findOrCreateIteration.iteration_id, owner_id: checkMyClass.user_id, milestone_id: milestone_id, class_id: class_id }
                        }
                    )
                    return setDeadlineAgain;
                }
                const createSettingIter = await IterationSetting.create({
                    iteration_id: findOrCreateIteration.iteration_id,
                    sourceanddemo: 10,
                    document: 20,
                    product: 70
                });
                if (!createSettingIter) throw new ErrorResponse(400, "Create setting iteration failed");
                return findOrCreateIteration;
            }
            const [findOrCreateIteration, created] = await Iteration.findOrCreate(
                {
                    where: { milestone_id: findMilestone.milestone_id, owner_id: user_id, class_id: class_id },
                    defaults: {
                        milestone_id: milestone_id,
                        name: findMilestone.name,
                        startDate: startDate,
                        endDate: endDate,
                        owner_id: user_id,
                        class_id: class_id
                    }
                }
            )
            if (!created) {
                const setDeadlineAgain = await Iteration.update(
                    { startDate: startDate, endDate: endDate, status: true },
                    {
                        where: { iteration_id: findOrCreateIteration.iteration_id, owner_id: user_id, milestone_id: milestone_id, class_id: class_id }
                    }
                )
                return setDeadlineAgain;
            }
            const createSettingIter = await IterationSetting.create({
                iteration_id: findOrCreateIteration.iteration_id,
                sourceanddemo: 10,
                document: 20,
                product: 70
            });
            if (!createSettingIter) throw new ErrorResponse(400, "Create setting iteration failed");
            return findOrCreateIteration;
        } catch (error) {
            throw error;
        }
    }

    async settingIteration(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const { sourceanddemo, document, product } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getIteration = await Iteration.findOne({ where: { iteration_id: iteration_id } });
            const findClass = await Class.findOne({ where: { class_id: +getIteration.class_id, user_id: +user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: +getIteration.class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const checkMyClass = await Class.findOne({ where: { class_id: +getIteration.class_id, campus_id: campus_id, semester_id: semester_id } })
            if (checkMyClass.user_id !== user_id) {
                const findIteration = await Iteration.findOne({ where: { iteration_id: iteration_id, owner_id: checkMyClass.user_id } });
                if (!findIteration) throw new ErrorResponse(404, "No iteration found");
                const totalPercentage = parseInt(sourceanddemo) + parseInt(document) + parseInt(product);
                if (totalPercentage > 100 || totalPercentage < 100) throw new ErrorResponse(400, "The sum of the top 3 percentages must equal 100%.");
                const [findSetting, created] = await IterationSetting.findOrCreate({
                    where: {
                        iteration_id: iteration_id,
                        status: true
                    },
                    defaults: {
                        iteration_id: iteration_id,
                        sourceanddemo: sourceanddemo ? sourceanddemo : null,
                        document: document ? document : null,
                        product: product ? product : null,

                    }
                })
                if (!created) {
                    return await IterationSetting.update({
                        sourceanddemo: sourceanddemo ? sourceanddemo : null,
                        document: document ? document : null,
                        product: product ? product : null
                    }, {
                        where: {
                            iteration_id: iteration_id,
                            status: true
                        }
                    })
                }
            }
            const findIteration = await Iteration.findOne({ where: { iteration_id: iteration_id, owner_id: user_id } });
            if (!findIteration) throw new ErrorResponse(404, "No iteration found");
            const totalPercentage = parseInt(sourceanddemo) + parseInt(document) + parseInt(product);
            if (totalPercentage > 100 || totalPercentage < 100) throw new ErrorResponse(400, "The sum of the top 3 percentages must equal 100%.");
            const [findSetting, created] = await IterationSetting.findOrCreate({
                where: {
                    iteration_id: iteration_id,
                    status: true
                },
                defaults: {
                    iteration_id: iteration_id,
                    sourceanddemo: sourceanddemo ? sourceanddemo : null,
                    document: document ? document : null,
                    product: product ? product : null,

                }
            })
            if (!created) {
                return await IterationSetting.update({
                    sourceanddemo: sourceanddemo ? sourceanddemo : null,
                    document: document ? document : null,
                    product: product ? product : null
                }, {
                    where: {
                        iteration_id: iteration_id,
                        status: true
                    }
                })
            }
        } catch (error) {
            throw error;
        }
    }

    async getSetting(req) {
        const { campus_id, semester_id, iteration_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getIteration = await Iteration.findOne({ where: { iteration_id: iteration_id } });
            const findClass = await Class.findOne({ where: { class_id: +getIteration.class_id, user_id: +user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: +getIteration.class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const findSetting = await IterationSetting.findOne({
                where: {
                    iteration_id: iteration_id
                }
            })
            if (!findSetting) throw new ErrorResponse(404, 'This iteration has no settings')
            return findSetting;
        } catch (error) {
            throw error;
        }
    }

    async getDeadline(req) {
        const { campus_id, semester_id, milestone_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findClass = await Class.findOne({ where: { class_id: +class_id, user_id: +user_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found or you are not a Lecturer or CoLecturer of this Class");
            const checkMyClass = await Class.findOne({ where: { class_id: class_id, campus_id: campus_id, semester_id: semester_id } })
            const findMilestone = await Milestone.findOne({ where: { milestone_id: milestone_id, semester_id: semester_id, status: true } })
            if (!findMilestone) throw new ErrorResponse(404, "Milestone not found");
            if (checkMyClass.user_id !== user_id) {
                const getDeadline = await Iteration.findOne({ where: { milestone_id: findMilestone.milestone_id, owner_id: checkMyClass.user_id, class_id: class_id } });
                if (!getDeadline) throw new ErrorResponse(404, "Deadline not found");
                return getDeadline;
            }
            const getDeadline = await Iteration.findOne({ where: { milestone_id: findMilestone.milestone_id, owner_id: user_id, class_id: class_id } });
            if (!getDeadline) throw new ErrorResponse(404, "Deadline not found");
            return getDeadline;
        } catch (error) {
            throw error;
        }
    }

    async setCompletedIteration(req) {
        const { iteration_id, class_id } = req.params;
        const user_id = req.user.id;
        try {
            const result = await Iteration.update({ endDate: "2024-04-21 07:00:00" }, {
                where: {
                    iteration_id: iteration_id,
                    class_id: class_id,
                    owner_id: user_id
                }
            })
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Student
    async getDeadlineRoleStudent(req) {
        const { campus_id, semester_id, milestone_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getClassId = await UserClassSemester.findOne({ where: { user_id: user_id, semester_id: semester_id } });
            if (!getClassId) throw new ErrorResponse(404, "You have not taken any classes this semester");
            const getLecturerId = await Class.findOne({
                where: {
                    class_id: getClassId.class_id,
                    campus_id: campus_id,
                    semester_id: semester_id
                }
            });
            const findMilestone = await Milestone.findOne({ where: { milestone_id: milestone_id, semester_id: semester_id, status: true } })
            if (!findMilestone) throw new ErrorResponse(404, "Milestone not found");
            const getDeadline = await Iteration.findOne({ where: { milestone_id: findMilestone.milestone_id, owner_id: getLecturerId.user_id, class_id: getClassId.class_id } });
            if (!getDeadline) throw new ErrorResponse(404, "Deadline not found");
            return getDeadline;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = new IterationService();