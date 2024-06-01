const { User, Campus, Class, Project, Team, TeamUser, Semester, Iteration, UserClassSemester, UserRoleSemester, TeamIterationDocument, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const dayjs = require('dayjs');
const teamIterationDocumentService = require('../services/teamIterationDocument.service');
describe('getAllDocumentByIter', () => {
    test('', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 2,
                iteration_id: 1
            },
            user: {
                id: 1
            }
        };
        const result = await teamIterationDocumentService.getAllDocumentByIter(req);
        expect(Array.isArray(result)).toBe(true);
    });
});

describe('getDocumentByTeamID ', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         team_id:2,
        //         iteration_id: 1
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        // const result = await teamIterationDocumentService.getDocumentByTeamID(req);
        // // expect(result.length).toEqual(1);
        // expect(result).toHaveProperty('tid_id');
        // expect(result).toHaveProperty('path_file_doc');
        // expect(result).toHaveProperty('url_doc');
        // expect(result).toHaveProperty('path_file_final_present');
        // expect(result).toHaveProperty('iteration_id');
        // expect(result).toHaveProperty('team_id');
        // expect(result).toHaveProperty('Team');
    });
});

describe('getDocumentMyTeam', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         iteration_id: 1
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        
        // const result = await teamIterationDocumentService.getDocumentMyTeam(req);
        // // expect(result).toEqual(1);
        // expect(result).toHaveProperty('tid_id');
        // expect(result).toHaveProperty('path_file_doc');
        // expect(result).toHaveProperty('url_doc');
        // expect(result).toHaveProperty('path_file_final_present');
        // expect(result).toHaveProperty('iteration_id');
        // expect(result).toHaveProperty('team_id');
        // // expect(result).toHaveProperty('Team');
    });
});

describe('submitDocument', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         semester_id: 1,
        //         iteration_id: null
        //     },
        //     body: {
        //         url_doc: 'https://drive.google.com/drive/u/0/folders/1SEnFQScHTJHDvCfavKaiy2JVWrIhPfI3',
        //         path_file_final_present: ''
        //     },
        //     user: {
        //         id: 1
        //     },
        //     file: {
        //         path: ''
        //     }
        // };
        // const result = await teamIterationDocumentService.submitDocument(req);
        // expect(result).toEqual([1]); 
    });
});