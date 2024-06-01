const { User, Campus, Class, Project, Team, TeamUser, Semester, Iteration, UserClassSemester, ColectureClass, UserRoleSemester, TeamIterationDocument, TeamEvaluation, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');



class TeamEvaluationService {

    async gradeTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { grade_SCandDB, grade_SRS, grade_SDS, note } = req.body;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const findClass = await Class.findOne({ where: { user_id: user_id, class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found");
            const findTeam = await Team.findOne({ where: { team_id: team_id, class_id: class_id } });
            if (!findTeam) throw new ErrorResponse(404, 'Team not found')
            if ((grade_SCandDB < 0 || grade_SCandDB > 10) || (grade_SRS < 0 || grade_SRS > 10) || (grade_SDS < 0 || grade_SDS > 10)) throw new ErrorResponse(400, 'Scoring must be greater than 0 and less than 10')
            const [grade, created] = await TeamEvaluation.findOrCreate({
                where: {
                    // lecture_id: user_id,
                    team_id: team_id,
                    iteration_id: iteration_id,
                    semester_id: semester_id,
                },
                defaults: {
                    lecture_id: user_id,
                    team_id: team_id,
                    iteration_id: iteration_id,
                    grade_SCandDB: grade_SCandDB ? grade_SCandDB : null,
                    grade_SRS: grade_SRS ? grade_SRS : null,
                    grade_SDS: grade_SDS ? grade_SDS : null,
                    note: note ? note : null,
                    semester_id: semester_id,
                }
            })
            if (!created) {
                const findGradeTeam = await TeamEvaluation.findOne({
                    where: {
                        lecture_id: user_id,
                        team_id: team_id,
                        iteration_id: iteration_id,
                        semester_id: semester_id,
                    }
                })
                if (!findGradeTeam) throw new ErrorResponse(404, "The instructor has already graded this team, you cannot edit it")
                return await TeamEvaluation.update({
                    grade_SCandDB: grade_SCandDB ? grade_SCandDB : null,
                    grade_SRS: grade_SRS ? grade_SRS : null,
                    grade_SDS: grade_SDS ? grade_SDS : null,
                    note: note ? note : null,
                }, {
                    where: {
                        lecture_id: user_id,
                        team_id: team_id,
                        iteration_id: iteration_id,
                        semester_id: semester_id,
                    }
                })
            }
            return grade;
        } catch (error) {
            throw error;
        }
    }

    async getGradeTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        try {
            const checkSemesterActive=await Semester.findOne({where:{semester_id:semester_id,status:true}});
            if(!checkSemesterActive) throw new ErrorResponse(404,"This semester is not working")
            const findClass = await Class.findOne({ where: { user_id: user_id, class_id: class_id, campus_id: campus_id, semester_id: semester_id } });
            const findColectureClass = await ColectureClass.findOne({ where: { class_id: class_id, colecture_id: user_id, status: true } })
            if (!findClass && !findColectureClass) throw new ErrorResponse(404, "Class not found");
            const findTeam = await Team.findOne({ where: { team_id: team_id, class_id: class_id } });
            if (!findTeam) throw new ErrorResponse(404, 'Team not found')
            const getGradeTeam = await TeamEvaluation.findOne({
                where: {
                    team_id: team_id,
                    iteration_id: iteration_id,
                    semester_id: semester_id,
                }
            })
            return getGradeTeam;
        } catch (error) {
            throw error;
        }
    }


}
module.exports = new TeamEvaluationService();