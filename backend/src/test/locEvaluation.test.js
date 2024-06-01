const { Op, Sequelize, where } = require('sequelize');
const { User, Campus, Team, TeamUser, Milestone, LOCEvaluation, Iteration, ColectureClass, Project, TeamProject, FunctionRequirement, IterationSetting, Class, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const locEvaluationService = require('../services/locEvaluation.service');

describe('gradeForStudent', () => {
    test('should grade student correctly', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         iteration_id: 1,
        //         class_id: 1,
        //         team_id: 2
        //     },
        //     body: {
        //         student_id: 2,
        //         fcrqm_id: 1,
        //         quality: 100,
        //         graded_LOC: 30,
        //         note: 'test note'
        //     },
        //     user: {
        //         id: null
        //     }
        // };
        // const result = await locEvaluationService.gradeForStudent(req);
        // expect(result).toEqual([1]);
    });
});

describe('getFunctionRequirementScoring', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         class_id: 1,
        //         team_id: 2
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        // const result = await locEvaluationService.getFunctionRequirementScoring(req);
        // const lengthResult = result.length;
        // const where = {
        //     team_id: req.params.team_id,
        //     graded_LOC: null
        // };
        // const rs = await LOCEvaluation.findAll({ where });
        // expect(lengthResult).toEqual(rs.length);
    });
});

describe('getFunctionRequirementScoring', () => {
    test('Test getFuntionRequirementGraded function', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         iteration_id: 1,
        //         class_id: 1,
        //         team_id: 2
        //     },
        //     user: {
        //         id: 1
        //     }
        // };

        // const getLOCEvaluation = await locEvaluationService.getFuntionRequirementGraded(req);
    
        // expect(getLOCEvaluation).toBeDefined();
        // expect(Array.isArray(getLOCEvaluation)).toBe(true);
        // // const LOCEvaluation = await LOCEvaluation.findAll({
        // //     where: {
        // //         iteration_id: req.params.iteration_id,
        // //         team_id: req.params.team_id,
        // //         status: true
        // //     },});
        // if(getLOCEvaluation){
        //     getLOCEvaluation.forEach(item => {
        //         expect(item).toHaveProperty('locEvaluation_id');
        //         expect(item).toHaveProperty('graded_LOC');
        //         expect(item).toHaveProperty('iteration_id');
        //         expect(item).toHaveProperty('fcrqm_id');
        //         expect(item).toHaveProperty('quality');
        //         expect(item).toHaveProperty('student_id');
        //         expect(item).toHaveProperty('team_id');
        //         expect(item).toHaveProperty('lecture_id');
        //         expect(item).toHaveProperty('note');
        //         expect(item).toHaveProperty('status');
                
        //         // Kiểm tra thuộc tính của mô hình liên kết Team
        //         expect(item.Team).toBeDefined();
        //         expect(item.Team).toHaveProperty('team_id');
        //         expect(item.Team).toHaveProperty('name');
        
        //         // Kiểm tra thuộc tính của mô hình liên kết Student
        //         expect(item.Student).toBeDefined();
        //         expect(item.Student).toHaveProperty('user_id');
        //         expect(item.Student).toHaveProperty('email');
        //         expect(item.Student).toHaveProperty('code');
                
        //         // Kiểm tra thuộc tính của mô hình liên kết Lecture
        //         expect(item.Lecture).toBeDefined();
        //         expect(item.Lecture).toHaveProperty('user_id');
        //         expect(item.Lecture).toHaveProperty('email');
        //         expect(item.Lecture).toHaveProperty('code');
        //     });
        // }
    });
});