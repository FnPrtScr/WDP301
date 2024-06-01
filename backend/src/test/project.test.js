const { Op, Sequelize } = require('sequelize');
const { User, Campus, Class, Team, Project, TeamProject, TeamUser, ReviewerClass, Semester, UserClassSemester, UserRoleSemester, FunctionRequirement, sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const TeamService = require('../services/team.service');
const { getAllMyProject, createOne, getMyProject, updateOne, deleteOne, getAllProjectFromMyLecturer } = require('../services/project.service');
describe('ProjectSevices', () => {
    describe('getAllMyProject', () => {
        test('UTCID01', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1 },
                user: { id: 1 }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
                send: jest.fn()
            };
            const rs1 = await Project.findAll({
                where: { owner_id: req.user.id },
            });
            // const size2 = rs.length;
            const rs = await getAllMyProject(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(rs1);
        });
        test('UTCID02', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1 },
                user: { id: null }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
                send: jest.fn()
            };
            await getAllMyProject(req, res);
            expect(res.json).toHaveBeenCalledWith({
                message: "Project not found"
            });
        });
        test('UTCID03', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1 },
                user: { id: "ABC@!#" }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
                send: jest.fn()
            };
            await getAllMyProject(req, res);
            expect(res.json).toHaveBeenCalledWith({
                message: "Project not found"
            });
        });
        test('UTCID04', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1 },
                user: { id: 10 }
            };
            const res = {
                status: jest.fn(() => res),
                json: jest.fn(),
                send: jest.fn()
            };
            await getAllMyProject(req, res);
            expect(res.json).toHaveBeenCalledWith({
                message: "Project not found"
            });
        });
    });
    describe('updateOne', () => {
        test('UTCID01', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: 1 },
                body: { name: 'Updated Project', description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            const rs = await updateOne(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(rs).toEqual([1])
        });
        test('UTCID02', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: null },
                body: { name: 'Updated Project', description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            await updateOne(req, res, next);
            expect(next).toHaveBeenCalledWith(new ErrorResponse(404, "Project not found"));
        });
        test('UTCID03', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: "ABC@!#" },
                body: { name: 'Updated Project', description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            await updateOne(req, res, next);
            expect(next).toHaveBeenCalledWith(new ErrorResponse(404, "Project not found"));
        });
        test('UTCID04', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: 10 },
                body: { name: 'Updated Project', description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            const rs = await updateOne(req, res, next);
            expect(next).toHaveBeenCalledWith(new ErrorResponse(404, "Project not found"));
        });


        test('UTCID07', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: 1 },
                body: { name: null, description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            const rs = await updateOne(req, res, next);
            expect(rs).toEqual("notNull Violation: Project.name cannot be null");

        });
        test('UTCID08', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: 1 },
                body: { name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', description: 'Updated Description' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            const rs = await updateOne(req, res, next);
            expect(rs).toEqual("Data too long for column 'name' at row 1");

        });
        test('UTCID09', async () => {
            const req = {
                params: { campus_id: 1, semester_id: 1, project_id: 3 },
                user: { id: 1 },
                body: { name: "Updated Project", description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
            };
            const res = {
                send: jest.fn()
            };
            const next = jest.fn();
            const rs = await updateOne(req, res, next);
            expect(rs).toEqual("Data too long for column 'description' at row 1");
        });
        
    });
    describe('deleteOne', () => {
        // test('UTCID01', async () => {
        //     const req = {
        //         params: {
        //             campus_id: 1,
        //             semester_id: 1,
        //             project_id: 5
        //         },
        //         user: {
        //             id: 1
        //         }
        //     };
        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         send: jest.fn(),
        //         json: jest.fn()
        //     };
        //      const rs1 = await Project.findAll({
        //          where: { owner_id: req.user.id },
        // });
        //     await deleteOne(req, res);
        //     const rs2 = await Project.findAll({
        //          where: { owner_id: req.user.id },
        // });
        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.send).toHaveBeenCalledWith({
        //         success: true,
        //         message: "Delete project succeeded",
        //     })
        // expect(rs2).toHaveBeenCalledWith(rs1-1);

        // });
        test('UTCID02', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: null
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
        test('UTCID03', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: "ABC@!#"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
        test('UTCID04', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: 10
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
        test('UTCID05', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: 10
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
        test('UTCID06', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: null
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
        test('UTCID07', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                    project_id: 5
                },
                user: {
                    id: "ABC@!#"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };
            await deleteOne(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Project not found",
            })
        });
    });
    describe('getAllProjectFromMyLecturer', () => {
        test('UTCID01', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 2
                }
            };
            const expectedCount = await Project.count({ where: { owner_id: 1 } });
            const expectedResult = await Project.findAll({ where: { owner_id: 1 } });
            const result = await getAllProjectFromMyLecturer(req);
            expect(result).toEqual(expectedResult);
            expect(result.length).toEqual(expectedCount);
        });
        test('UTCID02', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 100
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Class not found');
            }
        });
        test('UTCID03', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: "ABC@!#"
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Class not found');
            }
        });
        test('UTCID04', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: null
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Class not found');
            }
        });
        test('UTCID05', async () => {
            const req = {
                params: {
                    campus_id: 100,
                    semester_id: 1,
                },
                user: {
                    id: 2
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Lecturer not found');
            }
        });
        test('UTCID06', async () => {
            const req = {
                params: {
                    campus_id: null,
                    semester_id: 1,
                },
                user: {
                    id: 2
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Lecturer not found');
            }
        });
        test('UTCID07', async () => {
            const req = {
                params: {
                    campus_id: "ABC@!#",
                    semester_id: 1,
                },
                user: {
                    id: 2
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual('Lecturer not found');
            }
        });
        test('UTCID08', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 100,
                },
                user: {
                    id: 1
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Class not found");
            }
        });
        test('UTCID09', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: null,
                },
                user: {
                    id: 1
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Class not found");
            }
        });
        test('UTCID010', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: "ABC@!#",
                },
                user: {
                    id: 1
                }
            };
            try {
                const result = await getAllProjectFromMyLecturer(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Class not found");
            }
        });
    });
    describe('getMyProject', () => {
        test('UTCID01', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 24
                }
            };
            const project = await TeamProject.findOne({
                where: {
                    team_id: 2
                },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'link_jira','email_owner','apiToken','project_tracking'],
                include: [
                    {
                        model: Project,
                        attributes: ['project_id', 'name', 'file_path_requirement', 'description']
                    },{
                        model: Team,
                        attributes:['class_id','name','quantity']
                    }
                ]
            });
            const result = await getMyProject(req);
            expect(result).toEqual(project);
        });
        test('UTCID02', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 100
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        
        test('UTCID03', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: "ABC@!#"
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID04', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: null
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID05', async () => {
            const req = {
                params: {
                    campus_id: 100,
                    semester_id: 1,
                },
                user: {
                    id: 19
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID06', async () => {
            const req = {
                params: {
                    campus_id: null,
                    semester_id: 1,
                },
                user: {
                    id: 19
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID07', async () => {
            const req = {
                params: {
                    campus_id: "ABC@!#",
                    semester_id: 1,
                },
                user: {
                    id: 19
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID08', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 100,
                },
                user: {
                    id: 19
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID09', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: null,
                },
                user: {
                    id: 19
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });
        test('UTCID10', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: "ABC@!#",
                },
                user: {
                    id: 100
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User is not attending class this semester");
            }
        });

        test('UTCID11', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 1
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("User does not join any team in this class");
            }
        });

        test('UTCID11', async () => {
            const req = {
                params: {
                    campus_id: 1,
                    semester_id: 1,
                },
                user: {
                    id: 2
                }
            };
            try {
                const result = await getMyProject(req);
            } catch (error) {
                expect(error.statusCode).toEqual(404);
                expect(error.message).toEqual("Your group has not chosen any project yet");
            }
        });
    });
   
        




});
       