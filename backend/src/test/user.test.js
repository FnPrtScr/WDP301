const { User, Role, Campus, UserRoleSemester, Semester, sequelize } = require('../models')
const bcrypt = require('bcrypt');
const { ErrorResponse } = require('../utils/response');
const { getOne, getAllUserRoles, createOneUser } = require('../services/user.service');


describe('getOne', () => {
  test('UTCID01', async () => {
    const req = {
      body: { email: "anhhdhe151311@fpt.edu.vn" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    await getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).not.toHaveBeenCalledWith(null);
  });
  test('UTCID02', async () => {
    const req = {
      body: { email: "tuannnhe151047@fpt.edu.vn" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    await getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).not.toHaveBeenCalledWith(null);
  });
  test('UTCID03', async () => {
    const req = {
      body: { email: "ABC@!#" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    await getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(null);
  });
  test('UTCID04', async () => {
    const req = {
      body: { email: null }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    await getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(null);
  });
  test('UTCID05', async () => {
    const req = {
      body: { email: "tuannnhe151047@gmail.com" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    await getOne(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(null);
  });
  // test('UTCID06', async () => {

  // });
  // test('UTCID07', async () => {

  // });
  // test('UTCID08', async () => {

  // });
  // test('UTCID09', async () => {

  // });
  // test('UTCID010', async () => {

  // });
});

describe('getAllUserRoles ', () => {
  test('UTCID01', async () => {
    const req = {
      body: {
        email: 'anhhdhe151311@fpt.edu.vn',
        campus_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).not.toEqual(null);
  });
  test('UTCID02', async () => {
    const req = {
      body: {
        email: "tuannnhe151047@fpt.edu.vn",
        campus_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).not.toEqual(null);
  });
  test('UTCID03', async () => {
    const req = {
      body: {
        email: "ABC@!#",
        campus_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID04', async () => {
    const req = {
      body: {
        email: null,
        campus_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID05', async () => {
    const req = {
      body: {
        email: "tuannnhe151047@gmail.com",
        campus_id: 1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID06', async () => {
    const req = {
      body: {
        email: 'anhhdhe151311@fpt.edu.vn',
        campus_id: 0,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID07', async () => {
    const req = {
      body: {
        email: 'anhhdhe151311@fpt.edu.vn',
        campus_id: -1,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID08', async () => {
    const req = {
      body: {
        email: 'anhhdhe151311@fpt.edu.vn',
        campus_id: null,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const result = await getAllUserRoles(req, res);
    expect(result).toEqual(null);
  });
  test('UTCID09', async () => {

  });
  test('UTCID010', async () => {

  });
});

describe('createOneUser', () => {
  test('UTCID01', async () => {
    //   const req = {
    //     body: {
    //         email: "anhhdhe1234578910@fpt.edu.vn",
    //         code: "HE12345678",
    //         campus_id: 1,
    //     }, 
    // };
    
    // const result = await createOneUser(req);
    // const findOne1 =await User.count({where:{ email: req.body.email ,campus_id: req.body.campus_id, status: true}});
    // expect(findOne1).toEqual(1);
  });
  test('UTCID02', async () => {
    // const req = {
    //   body: {
    //     email: "tuannnhe123456@fpt.edu.vn",
    //     code: 123,
    //     campus_id: 1,
    //   },
    // };
    // const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    // const result = await createOneUser(req);
    // const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    // expect(findOne1 + 1).toEqual(findOne2);
  });
  test('UTCID03', async () => {
    // const req = {
    //   body: {
    //     email: "anhhdhe12346@fpt.edu.vn",
    //     code: "HE 151311",
    //     campus_id: 1,
    //   },
    // };
    // const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    // const result = await createOneUser(req);
    // const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    // expect(findOne1 + 1).toEqual(findOne2);
  });
  test('UTCID04', async () => {
    const req = {
      body: {
        email: "ABC@!#",
        code: "HE12345",
        campus_id: 1,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("Validation error: Validation isEmail on email failed");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);
  });
  test('UTCID05', async () => {
    const req = {
      body: {
        email: null,
        code: "HE12345",
        campus_id: 1,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("notNull Violation: User.email cannot be null");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);

  });
  test('UTCID06', async () => {
    const req = {
      body: {
        email: "tuannnhe151047@fpt.edu.vn",
        code: "HE12345",
        campus_id: 1,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("User already exists");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);
  });
  test('UTCID07', async () => {
    const req = {
      body: {
        email: "anhhdhe12345@fpt.edu.vn",
        code: "HE12345",
        campus_id: 0,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("Cannot add or update a child row: a foreign key constraint fails (`doan1`.`User`, CONSTRAINT `User_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `Campus` (`campus_id`) ON DELETE CASCADE ON UPDATE CASCADE)");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);
  });
  test('UTCID08', async () => {
    const req = {
      body: {
        email: "anhhdhe12345@fpt.edu.vn",
        code: "HE12345",
        campus_id: -1,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("Cannot add or update a child row: a foreign key constraint fails (`doan1`.`User`, CONSTRAINT `User_ibfk_1` FOREIGN KEY (`campus_id`) REFERENCES `Campus` (`campus_id`) ON DELETE CASCADE ON UPDATE CASCADE)");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);
  });
  test('UTCID09', async () => {
    const req = {
      body: {
        email: "anhhdhe12345@fpt.edu.vn",
        code: "HE12345",
        campus_id: null,
      },
    };
    const findOne1 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    try {
      const result = await createOneUser(req);
    } catch (error) {
      expect(error.message).toBe("notNull Violation: User.campus_id cannot be null");
    }
    const findOne2 = await User.count({ where: { email: req.body.email, campus_id: req.body.campus_id, status: true } });
    expect(findOne1).toEqual(findOne2);
  });
  test('UTCID010', async () => {
    //   const req = {
    //     body: {
    //         email: "anhhdhe12346789@fpt.edu.vn",
    //         code: "HE151311",
    //         campus_id: 1,
    //     }, 
    // };
    
    // const result = await createOneUser(req);
    // const findOne1 =await User.count({where:{ email: req.body.email ,campus_id: req.body.campus_id, status: true}});
    // expect(findOne1).toEqual(1);
    
  });
  test('UTCID011', async () => {
    //   const req = {
    //     body: {
    //         email: "tuannnhe151047@gmail.com",
    //         code: "HE1234",
    //         campus_id: 1,
    //     }, 
    // };
    
    // const result = await createOneUser(req);
    // const findOne1 =await User.count({where:{ email: req.body.email ,campus_id: req.body.campus_id, status: true}});
    // expect(findOne1).toEqual(1);
    
  });
});
