const { User, Campus, Class, Project, Team, TeamUser, Semester, UserClassSemester, UserRoleSemester, sequelize } = require('../models')
const { Op, Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const moment = require("moment");
const { getAllTeamInClass, createOne, randomTeam, divisionDataTeam, setLeaderInTeam, addOneStudentIntoTeam, moveStudentIntoOtherTeam, removeMemberOutGroup, removeTeamInClass } = require('../services/team.service');
const TeamService = require('../services/team.service');



describe('getAllTeamInClass', () => {
    test('UTCID01', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        const result = await getAllTeamInClass(req, res);
        expect(result).toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam })
    });
    test('UTCID02', async () => {
        const req = {
            params: {
                campus_id: 100,
                semester_id: 1,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        await expect(async () => {
            await getAllTeamInClass(req, res);
        }).rejects.toThrow('Class not found');
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            // So sánh kết quả trả về
            expect(result).toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');

    });
    test('UTCID03', async () => {
        const req = {
            params: {
                campus_id: null,
                semester_id: 1,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                campus_id: "ABC@!#",
                semester_id: 1,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID05', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 100,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID06', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: null,
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID07', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: "ABC@!#",
                class_id: 1
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID08', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 100
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID09', async () => {
        const req = {
            params: {
                campus_id: 100,
                semester_id: 1,
                class_id: null
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
    test('UTCID010', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: "ABC@!#"
            },
            user: {
                id: 1
            }
        };
        const res = {};
        const findAllTeam = await Team.findAll({
            where: { class_id: req.params.class_id },
            include: [
                {
                    model: TeamUser,
                    attributes: ['team_id', 'isLead'],
                    include: [
                        {
                            model: User,
                            attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                [
                    Sequelize.literal(`CAST(SUBSTRING(name FROM 7) AS UNSIGNED)`), 'ASC'
                ]
            ]
        });
        const studentsInClass = await UserClassSemester.findAll({
            where: { class_id: req.params.class_id, semester_id: req.params.semester_id },
            include: [
                {
                    model: User,
                    attributes: ['user_id', 'email', 'code', 'first_name', 'last_name', 'avatar']
                }
            ],
            attributes: ['userClassSemester_id', 'user_id', 'class_id', 'semester_id']
        });
        const studentsWithGroup = await TeamUser.findAll({
            include: [{
                model: Team,
                where: { class_id: req.params.class_id },
                attributes: []
            }],
            attributes: ['student_id']
        });
        const studentsWithGroupIds = studentsWithGroup.map(student => student.dataValues.student_id);
        const studentsWithoutGroup = studentsInClass.filter(student => !studentsWithGroupIds.includes(student.user_id));
        await expect(async () => {
            const result = await getAllTeamInClass(req, res);
            expect(result).not.toEqual({ studentsWithoutGroup: studentsWithoutGroup, findAllTeam: findAllTeam });
        }).rejects.toThrow('Class not found');
    });
});


describe('createOne', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: {
        //       class_id: 1
        //     },
        //     user: {
        //         id: 1
        //     }
        //   };

        //   const res = {
        //     status: jest.fn(() => res),
        //     send: jest.fn(),
        //     json: jest.fn()
        //   };
        //   const count1 = await Team.count({ class_id: req.params.class_id});
        //   await createOne(req, res);
        //   const count2 = await Team.count({ class_id: req.params.class_id});
        //   expect(count1+1).toEqual(count2);
        //   expect(res.status).toHaveBeenCalledWith(200);
        //   expect(res.send).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         message: 'Create team successfully'
        //     }));
    });
    test('UTCID02', async () => {
        // const req = {
        //     params: {
        //       class_id: 2
        //     },
        //     user: {
        //         id: 1
        //     }
        //   };

        //   const res = {
        //     status: jest.fn(() => res),
        //     send: jest.fn(),
        //     json: jest.fn()
        //   };
        //   const count1 = await Team.count({ class_id: req.params.class_id});
        //   await createOne(req, res);
        //   const count2 = await Team.count({ class_id: req.params.class_id});
        //   expect(count1+1).toEqual(count2);
        //   expect(res.status).toHaveBeenCalledWith(200);
        //   expect(res.send).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         message: 'Create team successfully'
        //     }));
    });
    test('UTCID03', async () => {
        const req = {
            params: {
                class_id: 100
            },
            user: {
                id: 1
            }
        };

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        };
        const count1 = await Team.count({ class_id: req.params.class_id });
        await createOne(req, res);
        const count2 = await Team.count({ class_id: req.params.class_id });
        expect(count1).toEqual(count2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Class not found"
            }));
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                class_id: null,
            },
            user: {
                id: 1
            }
        };

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        };
        const count1 = await Team.count({ class_id: req.params.class_id });
        await createOne(req, res);
        const count2 = await Team.count({ class_id: req.params.class_id });
        expect(count1).toEqual(count2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Class not found"
            }));
    });
    test('UTCID05', async () => {
        const req = {
            params: {
                class_id: "ABC@!#"
            },
            user: {
                id: 1
            }
        };

        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
            json: jest.fn()
        };
        const count1 = await Team.count({ class_id: req.params.class_id });
        await createOne(req, res);
        const count2 = await Team.count({ class_id: req.params.class_id });
        expect(count1).toEqual(count2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Class not found"
            }));
    });
    test('UTCID06', async () => {
        // const req = {
        //     params: {
        //         class_id: 1
        //     },
        //     user: {
        //         id: 100
        //     }
        // };

        // const res = {
        //     status: jest.fn(() => res),
        //     send: jest.fn(),
        //     json: jest.fn()
        // };
        // const count1 = await Team.count({ class_id: req.params.class_id });
        // await createOne(req, res);
        // const count2 = await Team.count({ class_id: req.params.class_id });
        // expect(count1 + 1).toEqual(count2);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.send).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         message: 'Create team successfully'
        //     }));
    });
    test('UTCID07', async () => {
        // const req = {
        //     params: {
        //         class_id: 1
        //     },
        //     user: {
        //         id: null
        //     }
        // };

        // const res = {
        //     status: jest.fn(() => res),
        //     send: jest.fn(),
        //     json: jest.fn()
        // };
        // const count1 = await Team.count({ class_id: req.params.class_id });
        // await createOne(req, res);
        // const count2 = await Team.count({ class_id: req.params.class_id });
        // expect(count1 + 1).toEqual(count2);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.send).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         message: 'Create team successfully'
        //     }));
    });
    test('UTCID08', async () => {
        // const req = {
        //     params: {
        //         class_id: 1
        //     },
        //     user: {
        //         id: "ABC@!#"
        //     }
        // };

        // const res = {
        //     status: jest.fn(() => res),
        //     send: jest.fn(),
        //     json: jest.fn()
        // };
        // const count1 = await Team.count({ class_id: req.params.class_id });
        // await createOne(req, res);
        // const count2 = await Team.count({ class_id: req.params.class_id });
        // expect(count1 + 1).toEqual(count2);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.send).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         message: 'Create team successfully'
        //     }));
    });
    test('UTCID09', async () => {

    });
    test('UTCID010', async () => {

    });

});

describe('addOneStudentIntoTeam', () => {
    test('UTCID01', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 2,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user:{
                id: 1,
            }
        };
        const count1 = await TeamUser.count();
        const rs = await addOneStudentIntoTeam(req);
        const count2 = await TeamUser.count();
        expect(count1+1).toEqual(count2);
    });
    test('UTCID02', async () => {
        const req = {
            params: {
                campus_id: 100,
                semester_id: 2,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID03', async () => {
        const req = {
            params: {
                campus_id: null,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                campus_id: "ABC@!#",
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID05', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 100,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID06', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: null,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID07', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: "ABC@!#",
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID08', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 100
            },
            body: {
                student_id: 2,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID09', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: null
            },
            body: {
                student_id: 1,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID010', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: "ABC@!#"
            },
            body: {
                student_id: 1,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Class not found');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID011', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 100,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('You have not taken any classes this semester');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID012', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: null,
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('You have not taken any classes this semester');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID013', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: "ABC@!#",
                team_id: 1
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('You have not taken any classes this semester');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID014', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: 100
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Team not found!');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID015', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: null
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Team not found!');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID016', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1
            },
            body: {
                student_id: 2,
                team_id: "ABC@!#"
            },
            user: {
                id: null,
            }
        };
        const count1 = await TeamUser.count();

        await expect(async () => {
            const rs = await addOneStudentIntoTeam(req);
        }).rejects.toThrow('Team not found!');
        const count2 = await TeamUser.count();
        expect(count1).toEqual(count2);
    });
    test('UTCID17', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 1,
        //         class_id: 1
        //     },
        //     body: {
        //         student_id: 2,
        //         team_id: 1
        //     },
        //     user:{
        //         id: null,
        //     }
        // };
        // const count1 = await TeamUser.count();
        // const rs = await addOneStudentIntoTeam(req);
        // const count2 = await TeamUser.count();
        // expect(count1+1).toEqual(count2);
    });
    test('UTCID18', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 1,
        //         class_id: 1
        //     },
        //     body: {
        //         student_id: 1,
        //         team_id: 2
        //     },
        //     user:{
        //         id: null,
        //     }
        // };
        // const count1 = await TeamUser.count();
        // const rs = await addOneStudentIntoTeam(req);
        // const count2 = await TeamUser.count();
        // expect(count1+1).toEqual(count2);
    });
});

describe('moveStudentIntoOtherTeam', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 1,
        //         class_id: 1,
        //         team_id: 1
        //     },
        //     user: { id: 1 },
        //     body: { student_id: 26, new_team_id: 2 }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn()
        // };
        // const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // await moveStudentIntoOtherTeam(req, res);
        // const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // expect(countOldTeam1-1).toEqual(countOldTeam2);
        // expect(countNewTeam1+1).toEqual(countNewTeam2);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.send).toHaveBeenCalledWith({ success: true, message: "Move student successfully" });
    });
    test('UTCID02', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 1,
        //         class_id: 1,
        //         team_id: 1
        //     },
        //     user: { id: 1 },
        //     body: { student_id: 28, new_team_id: 3 }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn()
        // };
        // const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // await moveStudentIntoOtherTeam(req, res);
        // const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // expect(countOldTeam1-1).toEqual(countOldTeam2);
        // expect(countNewTeam1+1).toEqual(countNewTeam2);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(res.send).toHaveBeenCalledWith({ success: true, message: "Move student successfully" });
    });
    test('UTCID03', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1,
                team_id: 1
            },
            user: { id: 1 },
            body: { student_id: 100, new_team_id: 2 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        await moveStudentIntoOtherTeam(req, res);
        const countOldTeam2 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        expect(countOldTeam1).toEqual(countOldTeam2);
        expect(countNewTeam1).toEqual(countNewTeam2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1,
                team_id: 1
            },
            user: { id: 1 },
            body: { student_id: null, new_team_id: 2 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        await moveStudentIntoOtherTeam(req, res);
        const countOldTeam2 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        expect(countOldTeam1).toEqual(countOldTeam2);
        expect(countNewTeam1).toEqual(countNewTeam2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    });
    test('UTCID05', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 1,
        //         class_id: 1,
        //         team_id: 1
        //     },
        //     user: { id: 1 },
        //     body: { student_id: 28, new_team_id: null }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn()
        // };
        // const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // await moveStudentIntoOtherTeam(req, res);  
        // const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
        // const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
        // expect(countOldTeam1).toEqual(countOldTeam2);
        // expect(countNewTeam1).toEqual(countNewTeam2);
        // expect(res.status).toHaveBeenCalledWith(404);
        // expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    });
    test('UTCID06', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1,
                team_id: 1
            },
            user: { id: -1 },
            body: { student_id: 28, new_team_id: 2 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        await moveStudentIntoOtherTeam(req, res);
        const countOldTeam2 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        expect(countOldTeam1).toEqual(countOldTeam2);
        expect(countNewTeam1).toEqual(countNewTeam2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    });
    test('UTCID07', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: 1,
                team_id: 1
            },
            user: { id: null },
            body: { student_id: 28, new_team_id: 2 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        await moveStudentIntoOtherTeam(req, res);
        const countOldTeam2 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        expect(countOldTeam1).toEqual(countOldTeam2);
        expect(countNewTeam1).toEqual(countNewTeam2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    });
    test('UTCID08', async () => {
        const req = {
            params: {
                campus_id: 1,
                semester_id: 1,
                class_id: -1,
                team_id: 1
            },
            user: { id: 1 },
            body: { student_id: 28, new_team_id: 2 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        await moveStudentIntoOtherTeam(req, res);
        const countOldTeam2 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id } })
        const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id } })
        expect(countOldTeam1).toEqual(countOldTeam2);
        expect(countNewTeam1).toEqual(countNewTeam2);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    });
    // test('UTCID09', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: null,
    //             class_id: 1,
    //             team_id: 1
    //         },
    //         user: { id: 1 },
    //         body: { student_id: 28, new_team_id: 2 }
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn()
    //     };
    //     const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     await moveStudentIntoOtherTeam(req, res);  
    //     const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     expect(countOldTeam1).toEqual(countOldTeam2);
    //     expect(countNewTeam1).toEqual(countNewTeam2);
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    // });
    // test('UTCID10', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //             class_id: -1,
    //             team_id: 1
    //         },
    //         user: { id: 1 },
    //         body: { student_id: 28, new_team_id: 2 }
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn()
    //     };
    //     const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     await moveStudentIntoOtherTeam(req, res);  
    //     const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     expect(countOldTeam1).toEqual(countOldTeam2);
    //     expect(countNewTeam1).toEqual(countNewTeam2);
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    // });
    // test('UTCID011', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //             class_id: null,
    //             team_id: 1
    //         },
    //         user: { id: 1 },
    //         body: { student_id: 28, new_team_id: 2 }
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn()
    //     };
    //     const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     await moveStudentIntoOtherTeam(req, res);  
    //     const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     expect(countOldTeam1).toEqual(countOldTeam2);
    //     expect(countNewTeam1).toEqual(countNewTeam2);
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
    // });
    // test('UTCID012', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //             class_id: 1,
    //             team_id: -1
    //         },
    //         user: { id: 1 },
    //         body: { student_id: 28, new_team_id: 2 }
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn()
    //     };
    //     const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     await moveStudentIntoOtherTeam(req, res);  
    //     const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
    //     const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     expect(countOldTeam1).toEqual(countOldTeam2);
    //     expect(countNewTeam1).toEqual(countNewTeam2);
    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    // });
    // test('UTCID013', async () => {
    //     // const req = {
    //     //     params: {
    //     //         campus_id: 1,
    //     //         semester_id: 1,
    //     //         class_id: 1,
    //     //         team_id: null
    //     //     },
    //     //     user: { id: 1 },
    //     //     body: { student_id: 28, new_team_id: 2 }
    //     // };
    //     // const res = {
    //     //     status: jest.fn().mockReturnThis(),
    //     //     send: jest.fn()
    //     // };
    //     // const countOldTeam1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id }})
    //     // const countNewTeam1 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     // await moveStudentIntoOtherTeam(req, res);  
    //     // const countOldTeam2 = await TeamUser.count({ where: {  team_id: req.params.team_id, class_id: req.params.class_id }})
    //     // const countNewTeam2 = await TeamUser.count({ where: { team_id: req.body.new_team_id, class_id: req.params.class_id }})
    //     // expect(countOldTeam1).toEqual(countOldTeam2);
    //     // expect(countNewTeam1).toEqual(countNewTeam2);
    //     // expect(res.status).toHaveBeenCalledWith(404);
    //     // expect(res.send).toHaveBeenCalledWith({ message: "Student not found in Team" });
    // });


});

// describe('divisionDataTeam', () => {
//     test('should add one student into team successfully', async () => {
//         // Mock request parameters
//         const req = {
//             params: {
//                 campus_id: 1,
//                 semester_id: 1,
//                 class_id: 1
//             },
//             body: {
//                 student_id: 1,
//                 team_id: 1
//             }
//         };

//         // Mock findClass, findTeam, findStudentInClass
//         Class.findOne = jest.fn().mockResolvedValueOnce({});
//         Team.findOne = jest.fn().mockResolvedValueOnce({});
//         UserClassSemester.findOne = jest.fn().mockResolvedValueOnce({});

//         const mockAddIntoTeam = { team_id: 1, student_id: 1, isLead: false };
//         // Mock create, count, and update methods
//         TeamUser.create = jest.fn().mockResolvedValueOnce(mockAddIntoTeam);
//         TeamUser.count = jest.fn().mockResolvedValueOnce(1);
//         Team.update = jest.fn().mockResolvedValueOnce({});

//         // Call the function
//         const result = await addOneStudentIntoTeam(req);

//         // Assertions
//         expect(Class.findOne).toHaveBeenCalled();
//         expect(Team.findOne).toHaveBeenCalled();
//         expect(UserClassSemester.findOne).toHaveBeenCalled();
//         expect(TeamUser.create).toHaveBeenCalled();
//         expect(TeamUser.count).toHaveBeenCalled();
//         expect(Team.update).toHaveBeenCalled();
//         expect(result).toEqual(mockAddIntoTeam);  
//     });
//     test('should throw error when class is not found', async () => {
//         // Mock request parameters
//         const req = {
//             params: {
//                 campus_id: 1,
//                 semester_id: 1,
//                 class_id: 1
//             },
//             body: {
//                 student_id: 1,
//                 team_id: 1
//             }
//         };   
//         // Mock findClass to return null
//         Class.findOne = jest.fn().mockResolvedValueOnce(null);
//         // Call the function and expect it to throw an error
//         await expect(addOneStudentIntoTeam(req)).rejects.toThrowError(new ErrorResponse(404, "Class not found"));
//     });
//     test('should throw error when team is not found', async () => {
//         // Mock request parameters
//         const req = {
//             params: {
//                 campus_id: 1,
//                 semester_id: 1,
//                 class_id: 1
//             },
//             body: {
//                 student_id: 1,
//                 team_id: 1
//             }
//         };
//         // Mock findClass to return a class
//         Class.findOne = jest.fn().mockResolvedValueOnce({});
//         // Mock findTeam to return null
//         Team.findOne = jest.fn().mockResolvedValueOnce(null);
//         // Call the function and expect it to throw an error
//         await expect(addOneStudentIntoTeam(req)).rejects.toThrowError(new ErrorResponse(404, "Team not found!"));
//     });
//     // test('should throw error when student is not found', async () => {
//     //     // Mock request parameters
//     //     const req = {
//     //         params: {
//     //             campus_id: 1,
//     //             semester_id: 1,
//     //             class_id: 1
//     //         },
//     //         body: {
//     //             student_id: 1,
//     //             team_id: 1
//     //         }
//     //     };
//     //     // Mock findClass to return a class
//     //     Class.findOne = jest.fn().mockResolvedValueOnce({});
//     //     // Mock findTeam to return a team
//     //     Team.findOne = jest.fn().mockResolvedValueOnce({});
//     //     // Mock findStudentInClass to return null
//     //     UserClassSemester.findOne = jest.fn().mockResolvedValueOnce(null);
//     //     // Call the function and expect it to throw an error
//     //     await expect(addOneStudentIntoTeam(req)).rejects.toThrowError(new ErrorResponse(404, "Student not found"));
//     // });
// });


// describe('moveStudentIntoOtherTeam', () => {
//     test('should move student into other team successfully', async () => {
//         const req = {
//             params: {
//                 campus_id: 1,
//                 semester_id: 1,
//                 class_id: 1,
//                 team_id: 1
//             },
//             user: {
//                 id: 1
//             },
//             body: {
//                 student_id: 1,
//                 new_team_id: 2
//             }
//         };

//         Class.findOne = jest.fn().mockResolvedValueOnce({});
//         TeamUser.findOne = jest.fn().mockResolvedValueOnce({ isLead: true });
//         TeamUser.findAll = jest.fn().mockResolvedValueOnce([{ student_id: 1 }, { student_id: 2 }, { student_id: 3 }]);
//         TeamUser.update = jest.fn().mockResolvedValueOnce();
//         Team.update = jest.fn().mockResolvedValueOnce();
//         TeamUser.count = jest.fn().mockResolvedValueOnce(3);

//         const res = {
//             status: jest.fn().mockReturnThis(),
//             send: jest.fn(),
//             json: jest.fn(),
//         };
//         await moveStudentIntoOtherTeam(req, res);

//         expect(Class.findOne).toHaveBeenCalled();
//         expect(TeamUser.findOne).toHaveBeenCalled();
//         expect(TeamUser.findAll).toHaveBeenCalled();
//         expect(TeamUser.update).toHaveBeenCalled();
//         expect(Team.update).toHaveBeenCalled();
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.send).toHaveBeenCalledWith({ success: true, message: "Move student successfully" });
//     });
//     test('should return 404 if class is not found-UT2', async () => {
//         const req = {
//             params: {
//                 campus_id: 1,
//                 semester_id: 1,
//                 class_id: 1,
//                 team_id: 1
//             },
//             user: {
//                 id: 1
//             },
//             body: {
//                 student_id: 1,
//                 new_team_id: 2
//             }
//         }
//         Class.findOne = jest.fn().mockResolvedValueOnce(null);
//         const res = {
//             status: jest.fn().mockReturnThis(),
//             send: jest.fn(),
//             json: jest.fn(),
//         };
//         await moveStudentIntoOtherTeam(req, res);
//         expect(Class.findOne).toHaveBeenCalled();
//         expect(res.status).toHaveBeenCalledWith(404);
//         expect(res.send).toHaveBeenCalledWith({ message: "Class not found" });
//     });
// });

// describe('removeMemberOutGroup function', () => {
//     test('should remove a member from a group successfully', async () => {
//         // Thiết lập giả định cho Class.findOne()
//         Class.findOne.mockResolvedValue({}); // Giả định rằng lớp học tồn tại

//         // Thiết lập giả định cho TeamUser.findOne()
//         TeamUser.findOne.mockResolvedValue({ isLead: false }); // Giả định rằng sinh viên tồn tại trong nhóm và không phải là trưởng nhóm

//         // Thiết lập giả định cho TeamUser.findAll()
//         const mockTeamUsers = [{ student_id: '123', isLead: true }, { student_id: '456', isLead: false }];
//         TeamUser.findAll.mockResolvedValue(mockTeamUsers);

//         // Thiết lập giả định cho Math.random()
//         const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0); // Mock Math.random() để luôn trả về 0

//         // Gọi hàm removeMemberOutGroup
//         await removeMemberOutGroup({
//             params: {
//                 campus_id: 'campus123',
//                 semester_id: 'semester123',
//                 class_id: 'class123',
//                 team_id: 'team123',
//                 student_id: '456', // Sinh viên muốn loại khỏi nhóm
//             },
//             user: { id: 'user123' } // Giả định user đã đăng nhập
//         });

//         // Kiểm tra các phương thức đã được gọi với đúng đối số
//         expect(Class.findOne).toHaveBeenCalledWith({ where: { class_id: 'class123', user_id: 'user123' } });
//         expect(TeamUser.findOne).toHaveBeenCalledWith({ where: { student_id: '456', team_id: 'team123' } });
//         expect(TeamUser.update).toHaveBeenCalledWith({ isLead: true }, { where: { student_id: '123', team_id: 'team123' } });
//         expect(TeamUser.update).toHaveBeenCalledWith({ isLead: false }, { where: { student_id: '456', team_id: 'team123' } });
//         expect(TeamUser.destroy).toHaveBeenCalledWith({ where: { student_id: '456', team_id: 'team123', status: true } });
//         expect(TeamUser.count).toHaveBeenCalledWith({ where: { team_id: 'team123' } });
//         expect(Team.update).toHaveBeenCalledWith({ quantity: 1 }, { where: { team_id: 'team123', class_id: 'class123' } });

//         // Khôi phục hàm Math.random()
//         mockMathRandom.mockRestore();
//     });

//     // Bổ sung các test case khác nếu cần
// });
describe('removeMemberOutGroup', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: {
        //         class_id: 1,
        //         team_id: 2,
        //         student_id: 19
        //     },
        //     user: { id: 1 }
        // };
        // const rs = await TeamUser.count({ where: {team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        // const result = await removeMemberOutGroup(req);
        // const rs1 = await TeamUser.count({ where: {team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        // expect(rs-1).toEqual(rs1)

    });
    test('UTCID02', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: 2,
                student_id: 20
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Student not found in Team');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID03', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: -1,
                student_id: 20
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Student not found in Team');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: null,
                student_id: 20
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Student not found in Team');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID05', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: 2,
                student_id: -1
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Student not found in Team');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID06', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: 2,
                student_id: null
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Student not found in Team');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID07', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: 2,
                student_id: 24
            },
            user: { id: -1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID08', async () => {
        const req = {
            params: {
                class_id: 1,
                team_id: 2,
                student_id: 24
            },
            user: { id: null }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID09', async () => {
        const req = {
            params: {
                class_id: -1,
                team_id: 2,
                student_id: 24
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID010', async () => {
        const req = {
            params: {
                class_id: null,
                team_id: 2,
                student_id: 24
            },
            user: { id: 1 }
        };
        const rs = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })

        await expect(async () => {
            const result = await removeMemberOutGroup(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await TeamUser.count({ where: { team_id: req.params.team_id, class_id: req.params.class_id, status: true } })
        expect(rs).toEqual(rs1)
    });
});

describe('removeTeamInClass', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: {
        //         class_id: 1,
        //     },
        //     body:{
        //         teams_id: [7],
        //     },
        //     user: { id: 1 }
        // };
        // const rs = await Team.count({ where: {  class_id: req.params.class_id} })
        // const result = await removeTeamInClass(req);
        // const rs1 = await Team.count({ where: {  class_id: req.params.class_id} })
        // expect(rs - 1).toEqual(rs1)
    });
    test('UTCID02', async () => {
        const req = {
            params: {
                class_id: 1,
            },
            body: {
                teams_id: [8],
            },
            user: { id: -1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID03', async () => {
        const req = {
            params: {
                class_id: 1,
            },
            body: {
                teams_id: [11],
            },
            user: { id: null }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID04', async () => {
        const req = {
            params: {
                class_id: -1,
            },
            body: {
                teams_id: [11],
            },
            user: { id: 1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID05', async () => {
        const req = {
            params: {
                class_id: null,
            },
            body: {
                teams_id: [11],
            },
            user: { id: 1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Class not found');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID06', async () => {
        // const req = {
        //     params: {
        //         class_id: 1,
        //     },
        //     body: {
        //         teams_id: [8],
        //     },
        //     user: { id: 1 }
        // };
        // const rs = await Team.count({ where: { class_id: req.params.class_id } })
        // const result = await removeTeamInClass(req);
        // const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        // expect(rs - 1).toEqual(rs1)
    });
    test('UTCID07', async () => {
        // const req = {
        //     params: {
        //         class_id: 1,
        //     },
        //     body: {
        //         teams_id: [9,10],
        //     },
        //     user: { id: 1 }
        // };
        // const rs = await Team.count({ where: { class_id: req.params.class_id } })
        // const result = await removeTeamInClass(req);
        // const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        // expect(rs - 2).toEqual(rs1)
    });
    test('UTCID08', async () => {
        const req = {
            params: {
                class_id: 1,
            },
            body: {
                teams_id: [100],
            },
            user: { id: 1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Team with ID 100 not found.');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID09', async () => {
        const req = {
            params: {
                class_id: 1,
            },
            body: {
                teams_id: [-1],
            },
            user: { id: 1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow('Team with ID -1 not found.');
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
    test('UTCID010', async () => {
        const req = {
            params: {
                class_id: 1,
            },
            body: {
                teams_id: null,
            },
            user: { id: 1 }
        };
        const rs = await Team.count({ where: { class_id: req.params.class_id } })
        await expect(async () => {
            const result = await removeTeamInClass(req);
        }).rejects.toThrow("Cannot read properties of null (reading 'map')");
        const rs1 = await Team.count({ where: { class_id: req.params.class_id } })
        expect(rs).toEqual(rs1)
    });
});


describe('setLeaderInTeam', () => {
    test('UTCID01', async () => {
        const req = {
            params: {
                campus_id: null,
                semester_id: 1,
                class_id: 1,
                team_id: 3
            },
            body: {
                student_id: 7
            },
            user: {
                id: -1
            }
        };

        await expect(async () => {
            await setLeaderInTeam(req);
        }).rejects.toThrow('Class not found');
        // await setLeaderInTeam(req);
        // const checkLeadInTeam = await TeamUser.findOne({
        //     where: {
        //         team_id: req.params.team_id,
        //         class_id: req.params.class_id,
        //         isLead: true
        //     },
        //     attributes: ['student_id']
        // });
        // expect(checkLeadInTeam.student_id).toEqual(req.body.student_id);
    });
    test('UTCID02', async () => {

    });
    test('UTCID03', async () => {

    });
    test('UTCID04', async () => {

    });
    test('UTCID05', async () => {

    });
    test('UTCID06', async () => {

    });
    test('UTCID07', async () => {

    });
    test('UTCID08', async () => {

    });
    test('UTCID09', async () => {

    });
    test('UTCID010', async () => {

    });
});
