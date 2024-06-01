const { User, Campus, Class, Project, Team, TeamUser, TeamProject, ColectureClass, Semester, UserClassSemester, FunctionRequirement, Notification, UserRoleSemester, sequelize } = require('../models')
const { Op, Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const fs = require('fs');
const templateData = fs.readFileSync('./src/utils/notification.json', 'utf8');
const templates = JSON.parse(templateData);
const teamProjectService = require('../services/teamProject.service');


describe('getAllTeamProject', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2
        //     },
        //     user: {
        //         id: 1
        //     },
        //     query: {}
        // };
        // const result = await teamProjectService.getAllTeamProject(req);
        // expect(result).toHaveProperty('teamProjects');
        // expect(result).toHaveProperty('total');
        // expect(result).toHaveProperty('totalPages');
        // // expect(result.teamProjects).toHaveLength(9); 
        // // expect(result.total).toEqual(9); 
        // // expect(result.totalPages).toEqual(1); 
    });
});

describe('assignProjectIntoTeam', () => {
    test('', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: null
        //     },
        //     body: {
        //         teams_id: [15], // ID của các nhóm
        //         project_id: 1, // ID của dự án
        //         class_id: 2 // ID của lớp học
        //     },
        //     user: {
        //         id: 1
        //     }
        // };

        // const result = await teamProjectService.assignProjectIntoTeam(req);
        // expect(result).toBeTruthy(); // Kết quả trả về là true (nếu không có lỗi xảy ra)
    });
});

describe('updateTeamProject', () => {
    test('should update team project correctly', async () => {
        // Mock req
        const req = {
            params: {
                campus_id: 1,
                semester_id: 2,
                teamproject_id: 2
            },
            body: {
                project_id: 1
            },
            user: {
                id: 1
            }
        };

        const result = await teamProjectService.updateTeamProject(req);
        expect(result).toBe(true);
        // await expect(async () => {
        //     const result = await teamProjectService.updateTeamProject(req);
        // }).rejects.toThrow('Class not found');  
    });
});
describe('deleteTeamProject', () => {
    test('should delete team project correctly', async () => {
        // const req = {
        //     params: {
        //         teamproject_id: 2
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        // TeamProject.destroy = jest.fn().mockResolvedValue(true);
        // const result = await teamProjectService.deleteTeamProject(req);

        // // Assertions
        // expect(result).toBe(true);
        
    });
});

describe('deleteTeamProject', () => {
    test('should delete team project correctly', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id:2
            },
            user: {
                id: 1
            }
        };
        const result = await teamProjectService.getProjectByTeamId(req);
        // Assertions
        // expect(result).toBe(true);
        
    });
});
