const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Project, Team, Point, TeamUser, TeamProject, Milestone, ColectureClass, Iteration, LOCEvaluation, TeamEvaluation, IterationSetting, Semester, UserClassSemester, FunctionRequirement, Notification, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const pointServices = require('../services/point.service');

describe('gradePointAutoByTeam', () => {
    test('', async () => {
        const req = {
            params: {
                semester_id: 2,
                iteration_id: 1,
                class_id: 1,
                team_id: 2
            },
            user: {
                id: 1
            }
        };

        const rs = await pointServices.gradePointAutoByTeam(req);
        
        
    });
});