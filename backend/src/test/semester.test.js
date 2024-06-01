const { getOne, checkEmailInDB, createOne, updateOne, deleteOne } = require('../services/semester.service');
const { User, Campus, Milestone, Iteration, Class, Semester, UserClassSemester, UserRoleSemester } = require('../models')
const semesterService = require('../services/semester.service');
describe('SemesterService', () => {
  describe('getOne', () => {
    // test('UTCID01', async () => {
    //   const Req = { body: { name_semester: 'Spring2024' } };
    //   const Res = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn(),
    //   };
    //   await getOne(Req, Res);
    //   expect(Res.status).toHaveBeenCalledWith(200);
    //   expect(Res.json).not.toEqual(null);
    // });

    // test('UTCID02', async () => {
    //   const Req = { body: { name_semester: 'InvalidSemester' } };
    //   const Res = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn(),
    //   };
    //   await getOne(Req, Res);
    //   expect(Res.status).toHaveBeenCalledWith(200);
    //   expect(Res.json).toHaveBeenCalledWith(null);
    // });

    // test('UTCID03', async () => {
    //   const Req = { body: { name_semester: null } };
    //   const Res = {
    //     status: jest.fn().mockReturnThis(),
    //     json: jest.fn(),
    //   };
    //   await getOne(Req, Res);
    //   expect(Res.status).toHaveBeenCalledWith(200);
    //   expect(Res.json).toHaveBeenCalledWith(null);
    // });

  });

  describe('createOne', () => {
    // test('UTCID01', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring2025",
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.send).toHaveBeenCalledWith("Create Semester Successfull!");
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });

    // test('UTCID02', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring      2026",
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.send).toHaveBeenCalledWith("Create Semester Successfull!");
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });

    // test('UTCID03', async () => {
    //   const req = {
    //     body: {
    //       name_semester: null,
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   const rs = await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({"message": "notNull Violation: Semester.name cannot be null", "success": false});
    // });

    // test('UTCID04', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring2024",
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   const rs = await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("Semester already exists!");
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });

    // test('UTCID05', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring2027",
    //       startDate: new Date(),
    //       endDate: new Date(),
    //     },
    //     user: {
    //       id: 1,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   const rs = await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.send).toHaveBeenCalledWith("Create Semester Successfull!");
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });

    // test('UTCID06', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring2012",
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: null,
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   const rs = await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({"message": "notNull Violation: UserRoleSemester.user_id cannot be null", "success": false});
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });

    // test('UTCID07', async () => {
    //   const req = {
    //     body: {
    //       name_semester: "Spring2033",
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //     user: {
    //       id: "ABC@!#",
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   // Chạy hàm createOne
    //   const rs = await createOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({"message": "Incorrect integer value: 'ABC@!#' for column 'user_id' at row 1", "success": false});
    //   expect(res.json).not.toHaveBeenCalled(); // Kiểm tra xem res.json không được gọi trong trường hợp này
    // });
  });

  describe('updateOne', () => {
    test('UTCID01', async () => {
      const req = {
        params: {
          semester_id: 3,
        },
        body: {
          name_semester: "summer2025",
          startDate: new Date('10/05/2025	'),
          endDate: new Date('10/05/2024	'),
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      await updateOne(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Semester updated successfully!");
    });

    test('UTCID02', async () => {
      // const req = {
      //   params: {
      //     semester_id: null,
      //   },
      //   body: {
      //     name_semester: "Spring2032",
      //     startDate: new Date('11/01/2025'),
      //     endDate: new Date('11/12/2025'),
      //   },
      // };
      // const res = {
      //   status: jest.fn().mockReturnThis(),
      //   send: jest.fn(),
      // };
      // await updateOne(req, res);
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
      // expect(res.status).toHaveBeenCalledWith(500);
      // expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });

    test('UTCID03', async () => {
      // const req = {
      //   params: {
      //     semester_id: "ABC@!#"	,
      //   },
      //   body: {
      //     name_semester: "Spring2032",
      //     startDate: new Date('11/01/2025'),
      //     endDate: new Date('11/12/2025'),
      //   },
      // };
      // const res = {
      //   status: jest.fn().mockReturnThis(),
      //   send: jest.fn(),
      // };
      // await updateOne(req, res);
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
    });

    test('UTCID04', async () => {
      // const req = {
      //   params: {
      //     semester_id: 2,
      //   },
      //   body: {
      //     name_semester: 123,
      //     startDate: new Date('11/01/2025'),
      //     endDate: new Date('11/12/2025'),
      //   },
      // };
      // const res = {
      //   status: jest.fn().mockReturnThis(),
      //   send: jest.fn(),
      // };
      // await updateOne(req, res);
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.send).toHaveBeenCalledWith("Semester updated successfully!");
    });

    test('UTCID05', async () => {
    //   const req = {
    //     params: {
    //       semester_id: 2,
    //     },
    //     body: {
    //       name_semester: null,
    //       startDate: new Date('11/01/2025'),
    //       endDate: new Date('11/12/2025'),
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };
    //   await updateOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });

    test('UTCID06', async () => {
    //   const req = {
    //     params: {
    //       semester_id: 2,
    //     },
    //     body: {
    //       name_semester: "Spring2032",
    //       startDate: new Date(),
    //       endDate: new Date(),
    //     },
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //   };
    //   await updateOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.send).toHaveBeenCalledWith("Semester updated successfully!");
    });
  });
  describe('deleteOne', () => {
    test('UTCID01', async () => {
      // const req = {
      //   params: {
      //     semester_id: 3
      //   }
      // };
      // const res = {
      //   status: jest.fn().mockReturnThis(),
      //   send: jest.fn()
      // };
      // const count1 = await Semester.count();
      // await deleteOne(req, res);
      // const count2 = await Semester.count();
      // expect(count1).toEqual(count2);
      // expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.send).toHaveBeenCalledWith("Semester deleted successfully!");
    });

    // test('UTCID02', async () => {
    //   const req = {
    //     params: {
    //       semester_id: null
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn()
    //   };
    //   await deleteOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
    // });

    // test('UTCID03', async () => {
    //   const req = {
    //     params: {
    //       semester_id: "ABC@!#"	
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn()
    //   };
    //   await deleteOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
    // });

    // test('UTCID04', async () => {
    //   const req = {
    //     params: {
    //       semester_id: 100	
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn()
    //   };
    //   await deleteOne(req, res);
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
    // });

  });
  describe('getAll', () => {
    test('UTCID01', async () => {
        // const req = {
        //     query: {
        //         keyword:"Spring    ",
        //         year: "",
        //         page:'1',
        //         limit:'10',
        //     }
        // };
        // let totalValue = null;
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn((data) => {
        //         totalValue = data.currentPageCount;
        //         message = data.message
        //     })
        // };
        // const result = await semesterService.getAll(req, res);
        // expect(res.status).toHaveBeenCalledWith(200);
        // expect(totalValue).toEqual(4);
        // expect(res.status).toHaveBeenCalledWith(500);
        // expect(message).toEqual("Incorrect DATETIME value: 'Invalid date'");
    });
  });
  describe('changeStatus', () => {
    test('True', async () => {
        // const req = {
        //     params: {
        //         semester_id: 3,
        //     }
        // };
        // const res = {
        //     status: jest.fn().mockReturnThis(),
        //     send: jest.fn()
        //   };
        // const findSemester1 = await Semester.findOne({ where: { semester_id: req.params.semester_id } });
        // const status1 = findSemester1.status 
        // const result = await semesterService.changeStatus(req, res);
        // const findSemester2 = await Semester.findOne({ where: { semester_id: req.params.semester_id } });
        // const status2 = findSemester2.status 

        // expect(status1).not.toEqual(status2);
        // expect(res.status).toHaveBeenCalledWith(200);
       
    });
    test('False', async () => {
      // const req = {
      //     params: {
      //         semester_id: "@123",
      //     }
      // };
      // const res = {
      //     status: jest.fn().mockReturnThis(),
      //     send: jest.fn()
      //   };
      // const result = await semesterService.changeStatus(req, res);
      // expect(res.status).toHaveBeenCalledWith(400);
      // expect(res.send).toHaveBeenCalledWith("Semester does not exist!");
      
  });
  });
});