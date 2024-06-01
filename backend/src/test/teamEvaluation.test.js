const { User, Campus, Class, Project, Team, TeamUser, Semester, Iteration, UserClassSemester, ColectureClass, UserRoleSemester, TeamIterationDocument, TeamEvaluation, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');
const teamEvaluationService = require('../services/teamEvaluation.service');
const assert = require('assert');
describe('gradeTeam', () => {
    test('should grade the team correctly', async () => {
        // Tạo đối tượng req giả lập
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         iteration_id: 1,
        //         class_id: 1,
        //         team_id: null
        //     },
        //     body: {
        //         grade_SCandDB: 10, // Điểm số thích hợp
        //         grade_SRS: 10,      // Điểm số thích hợp
        //         grade_SDS: 10,      // Điểm số thích hợp
        //         note: 'test note' // Ghi chú thích hợp
        //     },
        //     user: {
        //         id: 1 // ID của người dùng
        //     }
        // };

         
        //     const result = await teamEvaluationService.gradeTeam(req);
        //     expect(result).toEqual();
        
    });
});
describe('getGradeTeam', () => {
    test('should return the grade team correctly', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 2,
                iteration_id: 1,
                class_id: 1,
                team_id: 2
            },
            user: {
                id: 1 // ID của người dùng
            }
        };
        const teamEvaluation = {
            teamEvaluation_id: 1,
            grade_SCandDB: 20,
            grade_SRS: 10,
            grade_SDS: 10,
            iteration_id: 1,
            team_id: 2,
            lecture_id: 1,
            note: 'test note',
            semester_id: 2,
            status: false,
            createdAt: new Date('2024-04-08T08:29:12.000Z'),
            updatedAt: new Date('2024-04-08T10:33:56.000Z')
        };
        TeamEvaluation.findOne = jest.fn().mockResolvedValue(teamEvaluation);
        const result = await teamEvaluationService.getGradeTeam(req);
        expect(result).toEqual(teamEvaluation);
           
    });
});