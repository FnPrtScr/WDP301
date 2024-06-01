const { getAllLecture, createOne, updateOne, buildQuery } = require("../services/userrolesemester.service");
const { User, Campus, Class, Semester, UserClassSemester, UserRoleSemester } = require("../models");
const { Op, Sequelize } = require('sequelize');
const userrolesemesterService = require("../services/userrolesemester.service");
describe("Userrolesemester", () => {
  describe("createOne", () => {
    // test('UTCID01', async () => {
    //   // const req = {
    //   //   params: {
    //   //     campus_id: 1,
    //   //     semester_id: 1
    //   //   },
    //   //   body: {
    //   //     email: "anhhdhe12345@fpt.edu.vn"
    //   //   }
    //   // };
    //   // const res = {
    //   //   status: jest.fn().mockReturnThis(),
    //   //   send: jest.fn()
    //   // };
    //   // const UserRoleSemester1 = await UserRoleSemester.count();
    //   // await createOne(req, res);
    //   // const UserRoleSemester2 = await UserRoleSemester.count();
    //   // expect(res.status).toHaveBeenCalledWith(200);
    //   // expect(UserRoleSemester1 + 1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID02', async () => {
    //   // const req = {
    //   //   params: {
    //   //     campus_id: 1,
    //   //     semester_id: 1
    //   //   },
    //   //   body: {
    //   //     email: "anhhdhe12345@fe.edu.vn"
    //   //   }
    //   // };
    //   // const res = {
    //   //   status: jest.fn().mockReturnThis(),
    //   //   send: jest.fn()
    //   // };
    //   // const UserRoleSemester1 = await UserRoleSemester.count();
    //   // await createOne(req, res);
    //   // const UserRoleSemester2 = await UserRoleSemester.count();
    //   // expect(res.status).toHaveBeenCalledWith(200);
    //   // expect(UserRoleSemester1 + 1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID03', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: 1
    //     },
    //     body: {
    //       email: "ABC@!#"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn()
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   try {
    //     await createOne(req, res);
    //   } catch (error) {
    //     expect(error.message).toBe('"value" must be a valid email');
    //   }
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID04', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: 1
    //     },
    //     body: {
    //       email: null
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn()
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   try {
    //     await createOne(req, res);
    //   } catch (error) {
    //     expect(error.message).toBe('"value" must be a valid email');
    //   }
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID05', async () => {
    //   // const req = {
    //   //   params: {
    //   //     campus_id: 1,
    //   //     semester_id: 1
    //   //   },
    //   //   body: {
    //   //     email: "tuannnhe151047@fpt.edu.vn"
    //   //   }
    //   // };
    //   // const res = {
    //   //   status: jest.fn().mockReturnThis(),
    //   //   send: jest.fn()
    //   // };
    //   // const UserRoleSemester1 = await UserRoleSemester.count();
    //   // await createOne(req, res);
    //   // const UserRoleSemester2 = await UserRoleSemester.count();
    //   // expect(res.status).toHaveBeenCalledWith(400);
    //   // expect(res.send).toHaveBeenCalledWith({ "message": "The user already has this role this semester!", "success": false });
    //   // expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID06', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: 1
    //     },
    //     body: {
    //       email: "anhhdhe12345@gmail.com"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn()
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   try {
    //     await createOne(req, res);
    //   } catch (error) {
    //     expect(error.message).toBe('"value" must be a valid email');
    //   }
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    // });
    // test('UTCID07', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: 9999
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });
    // test('UTCID08', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: null
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });
    // test('UTCID09', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: "ABC@!#"
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });
    // test('UTCID010', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: 9999
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });
    // test('UTCID011', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: null
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });
    // test('UTCID012', async () => {
    //   const req = {
    //     params: {
    //       campus_id: 1,
    //       semester_id: "ABC@!#"
    //     },
    //     body: {
    //       email: "anhhdhe12345@fpt.edu.vn"
    //     }
    //   };
    //   const res = {
    //     status: jest.fn().mockReturnThis(),
    //     send: jest.fn(),
    //     json: jest.fn(),
    //   };
    //   const UserRoleSemester1 = await UserRoleSemester.count();
    //   await createOne(req, res);
    //   const UserRoleSemester2 = await UserRoleSemester.count();
    //   expect(UserRoleSemester1).toEqual(UserRoleSemester2);
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith("Internal Server Error");
    // });


  });

  describe('updateOne', () => {
  //   test('UTCID01', async () => {
  //     // const req = {
  //     //   params: {
  //     //     campus_id: 1,
  //     //     user_id: 1,
  //     //     semester_id: 1
  //     //   }
  //     // };
  //     // const res = {
  //     //   status: jest.fn(() => res),
  //     //   json: jest.fn()
  //     // };
  //     // await updateOne(req, res);
  //     // expect(res.status).toHaveBeenCalledWith(200);
  //     // expect(res.json).toHaveBeenCalledWith({ success: true, message: "User updated" });
  //   });
  //   test('UTCID02', async () => {
  //     // const req = {
  //     //   params: {
  //     //     campus_id: 1,
  //     //     user_id: 9999999999999999,
  //     //     semester_id: 1
  //     //   }
  //     // };
  //     // const res = {
  //     //   status: jest.fn(() => res),
  //     //   json: jest.fn()
  //     // };
  //     // await updateOne(req, res);
  //     // expect(res.status).toHaveBeenCalledWith(404);
  //     // expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID03', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 1,
  //         user_id: null,
  //         semester_id: 1
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID04', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 1,
  //         user_id: "ABC@!#"	,
  //         semester_id: 1
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID05', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 1,
  //         user_id: 1	,
  //         semester_id: 999999999999999
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID06', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 1,
  //         user_id: 1	,
  //         semester_id: null
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID07', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 1,
  //         user_id: 1	,
  //         semester_id: "ABC@!#"	
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID08', async () => {
  //     const req = {
  //       params: {
  //         campus_id: 999999999999999,
  //         user_id: 1	,
  //         semester_id: 1
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID09', async () => {
  //     const req = {
  //       params: {
  //         campus_id: null,
  //         user_id: 1	,
  //         semester_id: 1
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  //   test('UTCID010', async () => {
  //     const req = {
  //       params: {
  //         campus_id: "ABC@!#"	,
  //         user_id: 1,
  //         semester_id: 1
  //       }
  //     };
  //     const res = {
  //       status: jest.fn(() => res),
  //       json: jest.fn()
  //     };
  //     await updateOne(req, res);
  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.json).toHaveBeenCalledWith("User not found");
  //   });
  // });
  // describe('getAllLecture', () => {
  //   test('UTCID01', async () => {
  //       // const req = {
  //       //     params: {
  //       //         campus_id: 1,
  //       //         semester_id: 2
  //       //     },
  //       //     query: {
  //       //         keyword: "",
  //       //         filter: "",
  //       //         page: '1',
  //       //         limit: '10'
  //       //     }
  //       // };
  //       // const res = {
  //       //     status: jest.fn().mockReturnThis(),
  //       //     json: jest.fn((data) => {
  //       //         totalValue = data.total;
  //       //     })
  //       // };
  //       // const whereCondition = {
  //       //   [Op.or]: [
  //       //     { role_id: 2 },
  //       //     { role_id: 3 }
  //       //   ],
  //       //   semester_id: req.params.semester_id,
  //       //   '$User.campus_id$': req.params.campus_id,
  //       //   status: true
  //       // };
  //       // const Count = await UserRoleSemester.count({where: whereCondition})
  //       // const result = await userrolesemesterService.getAllLecture(req, res);
  //       // expect(res.status).toHaveBeenCalledWith(200);
  //       // // expect(res.json).toHaveBeenCalledWith(200);
  //       // expect(totalValue).toEqual(Count);
  //   });
});
});
