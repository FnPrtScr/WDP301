const { createOne, updateOne, buildQuery, deleteOne, importClasses, getMyClass, createOneStudentIntoClass, processArrEmailLecture, getAllMyClass, buildQueryGetAllMyClass, removeStudentInClass, getAll, processRemoveReviewerClass, createOneClass, updateOneClass } = require('../services/class.service');
const { User, Campus, Class, Semester, UserClassSemester, UserRoleSemester, TeamService, ColectureClass, ReviewerClass } = require('../models')
const importDataExcel = require('../imports/import-data-excel');
const { Op, Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/response');
const classService = require('../services/class.service');

//Head
describe('createOne', () => {
    test('UTCID01-02-04-07-09', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2
        //     },
        //     body: {
        //         reviewers: [2],
        //         colectures: [3],
        //         name: "TestClasssssss",
        //         lecturer_id: null
        //     },
        //     user: {
        //         id: 1 // User ID
        //       }
        // };

        // const rsClass1 = await Class.count();
        // const rsColectures1 = await ColectureClass.count();
        // const rsReviewers1 = await ReviewerClass.count();
        // const result = await createOne(req);
        // const rsClass2 = await Class.count();
        // const rsColectures2 = await ColectureClass.count();
        // const rsReviewers2 = await ReviewerClass.count();
        // expect(result).not.toBeNull(); 
        // expect(rsClass1+1).toEqual(rsClass2);
        // expect(rsColectures1+1).toEqual(rsColectures2);
        // expect(rsReviewers1+1).toEqual(rsReviewers2);
        // await expect(async () => {
        //     const result = await createOne(req);
        // }).rejects.toThrow('Class not found');
    });
    // test('UTCID06', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1
    //         },
    //         body: {
    //             reviewers: 1,
    //             colectures: 1,
    //             name: "@123@",
    //             lecturer_id: 1
    //         }
    //         ,
    //         user: {
    //             id: 1 // User ID
    //           }
    //     };

    //     try {
    //      await createOne(req);

    //     // Assertions
    //     }catch(error){
    //         expect(error.statusCode).toEqual(400);
    //         expect(error.message).toEqual('Class already exists!');
    //     }
    // });
    // test('UTCID03', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1
    //         },
    //         body: {
    //             reviewers: 1,
    //             colectures: 1,
    //             name: null,
    //             lecturer_id: 1
    //         },
    //         user: {
    //             id: 1 // User ID
    //           }
    //     };

    //     try {
    //      await createOne(req);

    //     // Assertions
    //     }catch(error){
    //         expect(error.message).toEqual("Cannot read properties of null (reading 'trim')");
    //     }
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1
    //         },
    //         body: {
    //             reviewers: {},
    //             colectures: 1,
    //             name: "Celebrity Culture: In many societies, there is a strong emphasis on celebrity culture, where individuals admire and emulate the lifestyles, behaviors, and fashion choices of celebrities and influencers. This norm encourages young people to follow fashion influencers as a means of aligning themselves with popular trends and aspirational lifestyles.Consumerism: Consumerist culture, which prioritizes the acquisition of material possessions and the pursuit of luxury goods, influences young people's attitudes towards fashion influencers. Influencers often promote products and brands, contributing to the normalization of consumerism among their followers. Social Media Influence: The rise of social media has transformed the way young people engage with fashion and influencers. Social media platforms serve as hubs for sharing and consuming fashion-related content, shaping young people's perceptions of beauty, style, and trends. The norm of constant connectivity and engagement on social media encourages young people to follow fashion influencers to stay informed and connected.Peer Pressure: Peer pressure is a powerful social norm that influences young people's decisions to pursue fashion influencers. Within peer groups, there may be expectations to conform to certain fashion trends and styles endorsed by influencers. The desire to fit in and gain acceptance among peers motivates young people to follow influencers and emulate their fashion choices.Individualism vs. Conformity: Cultural norms regarding individualism and conformity play a role in shaping young people's attitudes towards fashion influencers. While individualism emphasizes self-expression and uniqueness, conformity encourages adherence to social norms and trends. Young people navigate between these norms, seeking to express their identity while also conforming to prevailing fashion standards promoted by influencers.Globalization: Globalization has facilitated the spread of fashion trends and influencer culture across borders, leading to the homogenization of fashion preferences among young people worldwide. The normalization of Western fashion standards and the influence of international celebrities and influencers contribute to young people's decisions to pursue fashion influencers.Gender Norms: Gender norms influence young people's perceptions of fashion and influencers. Societal expectations regarding masculinity and femininity shape the types of influencers followed and the fashion choices endorsed. Young people may adhere to gender-specific norms when selecting influencers to follow and emulating their fashion styles.",
    //             lecturer_id: 1
    //         },
    //         user: {
    //             id: 1 // User ID
    //           }
    //     };

    //     try {
    //      await createOne(req);
    //      expect(result).not.toBeNull(); 
    //     // Assertions
    //     }catch(error){
    //         expect(error.message).toEqual("Data too long for column 'name' at row 1");
    //     }
    // });
    // test('UTCID08', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1
    //         },
    //         body: {
    //             reviewers: null,
    //             colectures: 1,
    //             name: "TestClass",
    //             lecturer_id: 1
    //         },
    //         user: {
    //             id: 1 // User ID
    //           }
    //     };

    //     try {
    //      await createOne(req);
    //      expect(result).not.toBeNull(); 
    //     // Assertions
    //     }catch(error){
    //         expect(error.message).toEqual("Class already exists!");
    //     }
    // });
});

describe('updateOne', () => {
    // test('UTCID01', async () => {
    //     const req = {
    //         params: { campus_id: 1, semester_id: 1, class_id: 1 },
    //         body: {
    //             reviewers: {}, // Giả sử có 2 reviewers
    //             colectures: {}, // Giả sử có 2 colectures
    //             name: 'Updated Class Name',
    //             lecturer_id: 5,
    //             status: true
    //         }
    //     };
    //     const result = await updateOne(req);
    //     // expect(result).not.toBeNull(); 
    // })
});
describe('deleteOne', () => {
    // test('UTCID05', async () => {
    // //     const req = {
    // //         params: {
    // //             campus_id: 1,
    // //             semester_id: 1,
    // //             class_id: 10
    // //         },
    // //         user: {
    // //           id: 1 // User ID
    // //         }
    // //     };
    // //     const res = {
    // //         status: jest.fn().mockReturnThis(),
    // //         send: jest.fn(),
    // //         json:jest.fn()
    // //     };

    // //     await deleteOne(req, res);

    // //     expect(res.status).toHaveBeenCalledWith(200);
    // //     expect(res.send).toHaveBeenCalledWith({ success: true, message: 'Class delete successfully' });
    // });
    // test('UTCID02', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //             class_id: null
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });

    // test('UTCID03', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //             class_id: "ABC@!#"
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
    // test('UTCID04', async () => {
    //     const req = {
    //         params: {
    //             campus_id: null,
    //             semester_id: null,
    //             class_id: null
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: "ABC@!#",
    //             semester_id: "ABC@!#",
    //             class_id: "ABC@!#"
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: null,
    //             class_id: 1
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: null,
    //             class_id: null
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: null,
    //             class_id: "ABC@!#"
    //         },
    //         user: {
    //           id: 1 // User ID
    //         }

    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json:jest.fn()
    //     };

    //     await deleteOne(req, res);

    //     expect(res.status).toHaveBeenCalledWith(404);
    //     expect(res.send).toHaveBeenCalledWith({ message: 'Class not found' });
    // });
});
describe('importClasses', () => {
    // test('', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1
    //         },
    //     };
    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     };
    //     await importClasses.call(context, req, res);
    // });
    test('UTCID01', async () => {

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
describe('getAllMyClass', () => {
    // test('should return classes successfully', async () => {
    //     const req = {
    //         params: {
    //             campus_id: 1,
    //             semester_id: 1,
    //         },
    //         user: {
    //             id: 1,
    //         },
    //         query: {
    //             keyword: null,
    //             filter: null,
    //             page: 1,
    //             limit: 10,
    //         },
    //     };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //     };


    //     await getAllMyClass(req, res);


    //     // expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith("ok");

    // });
});

describe('createOneClass', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: { campus_id: 1, semester_id: 2 },
        //     body: { name: 'Lớp1623' },
        //     user: { id: 1 }
        // };
        // const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
        // const result = await createOneClass(req);
        // const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
        // expect(count1+1).toEqual(count2);
    });
    // test('UTCID02', async () => {
    //     const req = {
    //         params: { campus_id: 100, semester_id: 100 },
    //         body: { name: 'Se12346789' },
    //         user: { id: 100 }
    //     };
    //         const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         // const result = await createOneClass(req);
    //         try {
    //             await createOneClass(req);
    //           } catch (error) {
    //             expect(error.message).toBe("Cannot add or update a child row: a foreign key constraint fails (`doan1`.`Class`, CONSTRAINT `Class_ibfk_2` FOREIGN KEY (`campus_id`) REFERENCES `Campus` (`campus_id`))");
    //           }

    //         const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         expect(count1).toEqual(count2);
    // });
    // test('UTCID03', async () => {
    //     const req = {
    //         params: { campus_id: null, semester_id: null },
    //         body: { name: 'Se12346789' },
    //         user: { id: null }
    //     };
    //         const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });

    //         try {
    //             const result = await createOneClass(req);
    //         } catch (error) {
    //             expect(error.message).toBe("Class already exists");
    //         }
    //         const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         // expect(res.send).toHaveBeenCalledWith("Class already exists");
    //         expect(count1).toEqual(count2);
    // });
    // test('UTCID04', async () => {
    // //     const req = {
    // //         params: { campus_id: 1, semester_id: 1 },
    // //         body: { name: "!@#$%^&*" },
    // //         user: { id: 1 }
    // //     };
    // //     const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    // //     const result = await createOneClass(req);
    // //     const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    // //     expect(count1+1).toEqual(count2);
    // });
    // test('UTCID04', async () => {
    // //     const req = {
    // //         params: { campus_id: 1, semester_id: 1 },
    // //         body: { name: "!@#$%^&*" },
    // //         user: { id: 1 }
    // //     };
    // //     const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    // //     const result = await createOneClass(req);
    // //     const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    // //     expect(count1+1).toEqual(count2);
    // });
    // test('UTCID05', async () => {
    //     // const req = {
    //     //     params: { campus_id: 1, semester_id: 1 },
    //     //     body: { name: "ひらがな" },
    //     //     user: { id: 1 }
    //     // };
    //     // const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //     // const result = await createOneClass(req);
    //     // const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //     // expect(count1+1).toEqual(count2);
    // });
    // test('UTCID06', async () => {
    //     const req = {
    //         params: { campus_id: 1, semester_id: 1 },
    //         body: { name: "SE140728" },
    //         user: { id: 1 }
    //     };
    //     const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //     // await expect(createOneClass(req)).rejects.toThrow(ErrorResponse);

    //     try {
    //         await createOneClass(req);
    //       } catch (error) {
    //         const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         expect(count1).toEqual(count2);
    //         expect(error).toBeInstanceOf(ErrorResponse);
    //         expect(error.message).toBe("Class already exists");
    //         expect(error.statusCode).toBe(400);
    //       }
    // });
    // test('UTCID05', async () => {
    //     const req = {
    //         params: { campus_id: 1, semester_id: 1 },
    //         body: { name: null },
    //         user: { id: 1 }
    //     };
    //     // const count1 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         // const result = await createOneClass(req);
    //         try {
    //             await createOneClass(req);
    //           } catch (error) {
    //             expect(error).toBeInstanceOf(TypeError);
    //             expect(error.message).toBe("Cannot read properties of null (reading 'trim')");
    //           }

    //         // const count2 = await Class.count({ where: { name: req.body.name.trim().toUpperCase().replace(/\s/g, ''), user_id: req.user.id, semester_id: req.params.semester_id } });
    //         // expect(count1).toEqual(count2);
    // });
});

describe('updateOneClass', () => {
    // test('UTCID01', async () => {
    //   // Mock request object
    //   const req = {
    //     params: { campus_id: 1, semester_id: 1, class_id: 2 },
    //     body: { name: '"Se1234"' },
    //     user: { id: 2 }, // Assuming user id
    //   };
    //   const result = await updateOneClass(req);
    //   expect(result).toEqual([1]);
    // });

    // test('UTCID02', async () => {
    //     // Mock request object
    //     const req = {
    //       params: { campus_id: "!#@##", semester_id: "!#@##", class_id: "!#@##" },
    //       body: { name: 'Se1234' },
    //       user: { id: "!#@##" }, // Assuming user id
    //     };

    //     try {
    //         const result = await updateOneClass(req);
    //         expect(result).toEqual([1]);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    //   });
    //   test('UTCID03', async () => {
    //     // Mock request object
    //     const req = {
    //       params: { campus_id: null, semester_id: null, class_id: null },
    //       body: { name: 'Se1234' },
    //       user: { id: null }, // Assuming user id
    //     };

    //     try {
    //         const result = await updateOneClass(req);
    //         expect(result).toEqual([1]);
    //       } catch (error) {
    //         expect(error.message).toBe("Class not found");
    //       }
    //   });
    //   test('UTCID04', async () => {
    //     // Mock request object
    //     const req = {
    //       params: { campus_id: 1, semester_id: 1, class_id: 2 },
    //       body: { name: "!@#$%^&*" },
    //       user: { id: 2 }, // Assuming user id
    //     };
    //         const result = await updateOneClass(req);
    //         expect(result).toEqual([1]);
    //   });
    //   test('UTCID05', async () => {
    //     // Mock request object
    //     const req = {
    //       params: { campus_id: 1, semester_id: 1, class_id: 2 },
    //       body: { name: "ひらがな" },
    //       user: { id: 2 }, // Assuming user id
    //     };
    //         const result = await updateOneClass(req);
    //         expect(result).toEqual([1]);
    //   });
    //   test('UTCID06', async () => {
    //     // Mock request object
    //     const req = {
    //       params: { campus_id: 1, semester_id: 1, class_id: 2 },
    //       body: { name: null },
    //       user: { id: 2 }, // Assuming user id
    //     };
    //     try {
    //         const result = await updateOneClass(req);
    //         // expect(result).toEqual([1]);
    //       } catch (error) {
    //         expect(error.message).toBe("Cannot read properties of null (reading 'trim')");
    //       }
    //   });
});

describe('createOneStudentIntoClass', () => {
    // test('', async () => {
    //     const req = {
    //         params: { campus_id: 1, semester_id: 2, class_id: 6 },
    //         body: { email_student: "anhhdhe151322       @fpt.edu.vn" },
    //         user: { id: 2 }, // Assuming user id
    //       };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json: jest.fn(),
    //     };
    //     const countStudentInClass1 = await UserClassSemester.count({ where: { class_id: req.params.class_id } });
    //     const rs = await createOneStudentIntoClass(req, res);
    //     const countStudentInClass2 = await UserClassSemester.count({ where: { class_id: req.params.class_id } });
    //     // expect(res.status).toHaveBeenCalledWith(500);
    //     // expect(res.send).toHaveBeenCalledWith(500);
    //     expect(countStudentInClass1).toEqual(countStudentInClass2);
    //     // expect(res.send).toHaveBeenCalledWith({ message: "This class has 30 students!" });
    //     // expect(res.json).toHaveBeenCalledWith({ message: "This class has 30 students!" });
    // });
});

describe('getMyClass', () => {
    test('True', async () => {
        //     const req = {
        //         params: { campus_id: 1, semester_id: 1 },
        //         user: { id: 2 }, // Assuming user id
        //       };
        //     const res = {
        //         status: jest.fn().mockReturnThis(),
        //         send: jest.fn(),
        //         json: jest.fn(),
        //     };
        //     const GMC = await UserClassSemester.findAll({
        //         where: { class_id: 1, semester_id: req.params.semester_id },
        //         include: [
        //             {
        //                 model: User,
        //                 attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
        //             },
        //         ],
        //     })
        //     const result = await getMyClass(req);
        //     expect(result).toEqual(GMC);
    });

    test('False', async () => {
        // const req = {
        //     params: { campus_id: -1, semester_id: -1 },
        //     user: { id: -1 }, // Assuming user id
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn(),
        //     json: jest.fn(),
        // };
        // try {
        //     const result = await getMyClass(req);
        // } catch (error) {
        //     expect(error.message).toBe("This semester is not working");
        // }

    });
    //     test('UTCID02', async () => {
    //     const req = {
    //         params: { campus_id: -1, semester_id: -1 },
    //         user: { id: -1 }, // Assuming user id
    //       };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json: jest.fn(),
    //     };
    //     try {
    //         const result = await getMyClass(req);
    //     } catch (error) {
    //         expect(error.message).toBe("Cannot read properties of null (reading 'class_id')");
    //     }

    // });

    // test('UTCID03', async () => {
    //     const req = {
    //         params: { campus_id: null, semester_id: null },
    //         user: { id: null }, // Assuming user id
    //       };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json: jest.fn(),
    //     };
    //     try {
    //         const result = await getMyClass(req);
    //     } catch (error) {
    //         expect(error.message).toBe("Cannot read properties of null (reading 'class_id')");
    //     }
    // });

    // test('UTCID04', async () => {
    //     const req = {
    //         params: { campus_id: 1, semester_id: -1 },
    //         user: { id: 1 }, // Assuming user id
    //       };
    //     const res = {
    //         status: jest.fn().mockReturnThis(),
    //         send: jest.fn(),
    //         json: jest.fn(),
    //     };
    //     try {
    //         const result = await getMyClass(req);
    //     } catch (error) {
    //         expect(error.message).toBe("Cannot read properties of null (reading 'class_id')");
    //     }
    // });
});
//
describe('getAll', () => {
    test('UTCID01', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2
        //     },
        //     query: {
        //         keyword: "",
        //         filter: "",
        //         page: '1',
        //         limit: '10'
        //     }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn((data) => {
        //         totalValue = data.total;
        //     })
        // };
        // const classesCount = await Class.count({
        //     where: {
        //         [Op.and]: [
        //             { campus_id: req.params.campus_id },
        //             { semester_id: req.params.semester_id },
        //             { status: true },
        //             { name: { [Op.like]: `%${req.query.keyword}%` } }
        //         ]
        //     },
        // })
        // const result = await classService.getAll(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(totalValue).toEqual(classesCount);
    });
});
describe('getAllStudentInClass', () => {
    test('True', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         class_id: 1
        //     },
        //     query: {
        //         keyword: '',
        //         filter: '',
        //         page: 1,
        //         limit: 10
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn(),
        //     json: jest.fn((data) => {
        //         totalValue = data.total;
        //     })
        // };
        // const countCondition = {
        //     where: {
        //         class_id: req.params.class_id,
        //         status: true
        //     }
        // };
        // const total = await UserClassSemester.count(countCondition);
        // const rs = await classService.getAllStudentInClass(req, res);
        // expect(totalValue).toEqual(total);
        // expect(res.status).toHaveBeenCalledWith(200);
    });
    test('False', async () => {
        // const req = {
        //     params: {
        //         campus_id: null,
        //         semester_id: 2,
        //         class_id: 2
        //     },
        //     query: {
        //         keyword: '',
        //         filter: '',
        //         page: 1,
        //         limit: 10
        //     },
        //     user: {
        //         id: 1
        //     }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn(),
        //     json: jest.fn((data) => {
        //         totalValue = data.total;
        //         err = data.message
        //     })
        // };
        // const countCondition = {
        //     where: {
        //         class_id: req.params.class_id,
        //         status: true
        //     }
        // };
        // const total = await UserClassSemester.count(countCondition);
        // const rs = await classService.getAllStudentInClass(req, res);
        // expect(res.status).toHaveBeenCalledWith(404);
        // expect(res.send).toHaveBeenCalledWith({ message: "Class not found!" });
    });
});

describe('getAllStudentInClass', () => {
    test('True', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //     },
        //     user: {
        //         id: 1
        //     },
        //     query: {
        //         keyword: '',
        //         filter: '',
        //         page: 1,
        //         limit: 10
        //     }
        // };

        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn((data) => {
        //         Value = data.data;
        //         err = data.message
        //     })
        // };
        // await classService.getAllMyClass(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(Value.rows.length).toEqual(4);
    });
    test('False', async () => {
        // const req = {
        //     params: {
        //         campus_id: null,
        //         semester_id: 2,
        //     },
        //     user: {
        //         id: 1
        //     },
        //     query: {
        //         keyword: '',
        //         filter: '',
        //         page: 1,
        //         limit: 10
        //     }
        // };

        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn((data) => {
        //         Value = data.data;
        //         err = data.message
        //     })
        // };
        // await classService.getAllMyClass(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(Value.rows.length).toEqual(0);
    });
});
describe('updateStudentInMyClass', () => {
    test('True', async () => {
        // const req = {
        //     params: {
        //         campus_id: 1,
        //         semester_id: 2,
        //         class_id: 1,
        //         student_id: 31,
        //     },
        //     body: {
        //         email_student: 'vudthe170345@fpt.edu.vn',
        //     },
        //     user: {
        //         id: 1
        //     },
        // };
        // const rs = await classService.updateStudentInMyClass(req);
        // expect(rs).toEqual([1])
        
    });
    test('False', async () => {
        // const req = {
        //     params: {
        //         campus_id: null,
        //         semester_id: 2,
        //         class_id: 1,
        //         student_id: 31,
        //     },
        //     body: {
        //         email_student: 'vudthe170345@fpt.edu.vn',
        //     },
        //     user: {
        //         id: 1
        //     },
        // };
        
        // // await expect(async () => {
        // //     const rs = await classService.updateStudentInMyClass(req);
        // // }).rejects.toThrow('Class not found');
        // await expect(async () => {
        //     const rs = await classService.updateStudentInMyClass(req);
        // }).rejects.toThrow('Student not found');
        
    });
});
//create deleteOne -add testcase 'should return status 200 with success message when class is deleted successfully'
//update deleteOne -add testcase 'should return status 500 with error message when an error occurs'