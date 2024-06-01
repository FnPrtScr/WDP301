const { User, Campus, Milestone, Iteration, Class, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const { ErrorResponse } = require('../utils/response');
const moment = require("moment");

class MilestoneService {

    //Lecturer
    async getAll(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const getAll = await Milestone.findAll({
                where: { semester_id: semester_id },
                attributes: ['milestone_id', 'semester_id', 'name'],
                include: [
                    {
                        model: Iteration,
                        where: {
                            owner_id: user_id,
                            status: true
                        },
                        attributes: ['iteration_id', 'name', 'milestone_id', 'startDate', 'endDate', 'owner_id'],
                        required: false
                    }
                ]
            });
            if (getAll.length <= 0) throw new ErrorResponse(404, "There are no iterations this term");
            return getAll;
        } catch (error) {
            throw error;
        }
    }


    //Student
    async getAllIteration(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const getClassId = await UserClassSemester.findOne({ where: { user_id: user_id, semester_id: semester_id } });
            if (!getClassId) throw new ErrorResponse(404, 'You have not taken any classes this semester');
            const getLecturerId = await Class.findOne({ where: { class_id: getClassId.class_id, campus_id: campus_id, semester_id: semester_id } })
            const getAll = await Milestone.findAll({
                where: { semester_id: semester_id },
                attributes: ['milestone_id', 'semester_id', 'name'],
                include: [
                    {
                        model: Iteration,
                        where: {
                            owner_id: getLecturerId.user_id,
                        },
                        attributes: ['iteration_id', 'name', 'milestone_id', 'startDate', 'endDate', 'owner_id'],
                        required: false
                    }
                ]
            });
            if (getAll.length <= 0) throw new ErrorResponse(404, "There are no iterations this term");
            return getAll;
        } catch (error) {
            throw error;
        }
    }




}
module.exports = new MilestoneService();