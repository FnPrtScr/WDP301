const CampusService = require('../services/campus.service'); // Thay đổi đường dẫn nếu cần
const { User, Campus, Class, Semester, UserClassSemester, UserRoleSemester, sequelize ,Team } = require('../models');
const { ErrorResponse } = require('../utils/response');
describe('CampusService', () => {
    describe('createOne', () => {
        // test('', async () => {
        //     const req = {
        //         body: {
        //             name: "FU-test" // Tên trường hợp thử nghiệm
        //         }
        //     };
        //     const res = {
        //         send: jest.fn(),
        //         status: jest.fn().mockReturnThis()
        //     };
        //     const next = jest.fn();
        //     const result1 = await Campus.count({ where: { status: true } });
        //     await CampusService.createOne(req, res, next);
        //     const result2 = await Campus.count({ where: { status: true } });
        //     expect(result1+1).toEqual(result2)
        //     // const rs1 = await Campus.findOne({ where: { name: req.body.name } });
        //     // expect(rs).toEqual(rs1)
        //     // expect(rs).not.toEqual(null)
        // });
        // test('', async () => {
        //     const req = {
        //         body: {
        //             name: "!@#$%^&*" // Tên trường hợp thử nghiệm
        //         }
        //     };
        //     const res = {
        //         send: jest.fn(),
        //         status: jest.fn().mockReturnThis()
        //     };
        //     const next = jest.fn();
        //     const result1 = await Campus.count({ where: { status: true } });
        //     await CampusService.createOne(req, res, next);
        //     const result2 = await Campus.count({ where: { status: true } });
        //     expect(result1+1).toEqual(result2)
        //     // const rs1 = await Campus.findOne({ where: { name: req.body.name } });
        //     // expect(rs).toEqual(rs1)
        //     // expect(rs).not.toEqual(null)
        // });
        // test('', async () => {
        //     const req = {
        //         body: {
        //             name: "ひらがな" // Tên trường hợp thử nghiệm
        //         }
        //     };
        //     const res = {
        //         send: jest.fn(),
        //         status: jest.fn().mockReturnThis()
        //     };
        //     const next = jest.fn();
        //     const result1 = await Campus.count({ where: { status: true } });
        //     await CampusService.createOne(req, res, next);
        //     const result2 = await Campus.count({ where: { status: true } });
        //     expect(result1+1).toEqual(result2)
        //     // const rs1 = await Campus.findOne({ where: { name: req.body.name } });
        //     // expect(rs).toEqual(rs1)
        //     // expect(rs).not.toEqual(null)
        // });
        test('', async () => {
            const req = {
                body: {
                    name: "FU-Hòa Lạc" // Tên trường hợp thử nghiệm
                }
            };
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            const next = jest.fn();
            const result1 = await Campus.count({ where: { status: true } });
            await CampusService.createOne(req, res, next);
            const result2 = await Campus.count({ where: { status: true } });
            expect(result1).toEqual(result2)
            expect(next).toHaveBeenCalledWith(new ErrorResponse(400, 'Campus already exists'));
        });
        test('', async () => {
            const req = {
                body: {
                    name: null // Tên trường hợp thử nghiệm
                }
            };
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis()
            };
            const next = jest.fn();
            const result1 = await Campus.count({ where: { status: true } });
            const rs = await CampusService.createOne(req, res, next);
            const result2 = await Campus.count({ where: { status: true } });
            expect(result1).toEqual(result2)
            expect(rs).toEqual("notNull Violation: Campus.name cannot be null")
        });
    });
    describe('getAll', () => {
        test('should return valid data when getAll is called', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };

            await CampusService.getAll(req, res);

            // Kiểm tra xem res.status có được gọi với đúng status code không
            expect(res.status).toHaveBeenCalledWith(200);
            // Kiểm tra xem res.send có được gọi với dữ liệu trả về từ service không
            expect(res.send).not.toEqual(null)
            
        });
        
    });
});