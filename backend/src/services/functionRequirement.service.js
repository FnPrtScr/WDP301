const { User, Campus, Class, Project, Semester, UserClassSemester, UserRoleSemester, FunctionRequirement, sequelize } = require('../models')
const { ErrorResponse } = require('../utils/response');
const moment = require("moment");
const { lowerCase, uppperCase } = require('../utils/format-string')
class FunctionRequirementService {
    async getFunctionRequirement(req, res) {
        const { campus_id, semester_id, project_id } = req.params;
        // const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProject = await Project.findOne({
                where: { project_id: +project_id },
                include: [
                    {
                        model: FunctionRequirement,
                        attributes: ['functionrequirement_id', 'name', 'feature', 'LOC', 'complexity', 'description']
                    }
                ],
                attributes: ['project_id', 'name', 'description', 'file_path_requirement']
            })
            if (!findProject) return res.status(404).send({ message: "Project not found" });
            return res.status(200).send({
                success: true,
                data: findProject
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async createOne(req, res) {
        const { campus_id, semester_id, project_id } = req.params;
        const user_id = req.user.id;
        const complexity = req.body.complexity;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: +user_id, type: 'lecturer_created' } });
            if (!findProject) return res.status(404).send({ message: "Project not found" });
            const LOC = lowerCase(complexity) === "simple" ? 60 :
                lowerCase(complexity) === "medium" ? 120 :
                    lowerCase(complexity) === "complex" ? 240 : 0;
            const createOne = await FunctionRequirement.create({ project_id: project_id, LOC: LOC, ...req.body });
            if (!createOne) return res.status(500).send({ message: "Create function requirement failed" });
            return res.status(200).send({
                success: true,
                message: "Create function requirement succeeded",
                data: createOne
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async deleteOne(req, res) {
        const { campus_id, semester_id, project_id, fcrqm_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) return res.status(404).json({
                success: false,
                message: "This semester is not working"
            });
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: user_id, type: 'lecturer_created' } });
            if (!findProject) return res.status(404).send({ message: "Project not found" });
            const findFcrqm = await FunctionRequirement.findOne({ where: { functionrequirement_id: fcrqm_id } });
            if (!findFcrqm) return res.status(404).send({ message: "Functionrequirement not found" });
            await FunctionRequirement.destroy({ where: { functionrequirement_id: fcrqm_id } })
            return res.status(200).send({
                success: true,
                message: "Delete function requirement succeeded",
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async updateOne(req, res, next) {
        const { campus_id, semester_id, project_id, fcrqm_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findProject = await Project.findOne({ where: { project_id: project_id, owner_id: user_id, type: 'lecturer_created' } });
            if (!findProject) throw new ErrorResponse(404, "Project not found");
            const findFcrqm = await FunctionRequirement.findOne({ where: { functionrequirement_id: fcrqm_id } });
            if (!findFcrqm) throw new ErrorResponse(404, "Functionrequirement not found");
            await FunctionRequirement.update(
                {
                    ...req.body
                }, {
                where: {
                    project_id: project_id,
                    functionrequirement_id: fcrqm_id
                }
            });
            return true;
        } catch (error) {
            return error;
        }
    }
}
module.exports = new FunctionRequirementService();