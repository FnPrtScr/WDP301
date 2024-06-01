const { UserClassSemester, Class, User,sequelize } = require('../models')
const moment = require("moment");
const importDataExcel = require('../imports/import-data-excel');
const { ErrorResponse } = require('../utils/response');
const { getMyLecturer  } = require('../services/userclasssemester.service');

describe('getMyLecturer ', () => {
    // test('UTCID01', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     const findClass = await UserClassSemester.findOne({ where: { user_id: req.user.id, semester_id: req.params.semester_id } });
    //     const MyLecturer = await Class.findOne({
    //         where: { class_id: findClass.class_id, campus_id: req.params.campus_id, semester_id: req.params.semester_id },
    //         include: [
    //             {
    //                 model: User,
    //                 as:"Lecture",
    //                 attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
    //             },
    //         ]
    //     });
    //     const result = await getMyLecturer(req);
    //     expect(result).toEqual(MyLecturer);
    // });
    // test('UTCID02', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 100,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
    // test('UTCID03', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: null,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
    // test('UTCID04', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: "ABC@!#",
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 100,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("My Lecturer not found");
    //       }
    // });
    // test('UTCID06', async () => {
    //     const req = {
    //         params: {
    //             campus_id: null,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("My Lecturer not found");
    //       }
    // });
    // test('UTCID07', async () => {
    //     const req = {
    //         params: {
    //             campus_id: "ABC@!#",
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("My Lecturer not found");
    //       }
    // });
    // test('UTCID08', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 100,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
    // test('UTCID09', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: null,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
    // test('UTCID010', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: "ABC@!#",
    //         },
    //         user: {
    //             id: 1,
    //         },
    //     };
    //     try {
    //         const result = await getMyLecturer(req);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    // });
});