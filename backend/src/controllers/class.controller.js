const asyncHandler = require('../utils/async-handler');
const ClassService = require("../services/class.service");
const { errorResponse, successResponse, ErrorResponse } = require('../utils/response');

module.exports = {

    // Head
    getAll: asyncHandler(async (req, res) => {
        const classes = await ClassService.getAll(req, res);
    }),
    createOne: asyncHandler(async (req, res, next) => {
        try {
            const classes = await ClassService.createOne(req);
            return res.status(201).send(successResponse(201, classes, "Create Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    updateOne: asyncHandler(async (req, res, next) => {
        try {
            const classes = await ClassService.updateOne(req);
            return res.status(201).send(successResponse(201, classes, "Update Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    importClasses: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.importClasses(req);
            return res.status(201).send(successResponse(201, classes));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    deleteOne: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.deleteOne(req);
            return res.status(201).send(successResponse(201, classes, "Delete Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
        
    }),
    getClassResit: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.getClassResit(req);
            return res.status(200).send(successResponse(200, classes));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
        
    }),
    setReviewerResit: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.setReviewerResit(req);
            return res.status(201).send(successResponse(201, classes));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
        
    }),

    // Lecture
    getAllMyClass: asyncHandler(async (req, res) => {
        const classes = await ClassService.getAllMyClass(req, res);
    }),
    createOneClass: asyncHandler(async (req, res, next) => {
        try {
            const classes = await ClassService.createOneClass(req);
            return res.status(201).send(successResponse(201, classes, "Create Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    updateOneClass: asyncHandler(async (req, res, next) => {
        try {
            const classes = await ClassService.updateOneClass(req);
            return res.status(201).send(successResponse(201, classes, "Update Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    getAllStudentInClass: asyncHandler(async (req, res) => {
        const classes = await ClassService.getAllStudentInClass(req, res);
    }),
    createOneStudentIntoClass: asyncHandler(async (req, res) => {
        const classes = await ClassService.createOneStudentIntoClass(req, res);
    }),
    updateStudentInMyClass: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.updateStudentInMyClass(req);
            return res.status(201).send(successResponse(201, classes, "Update Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),
    importStudentIntoClass: asyncHandler(async (req, res) => {
        const classes = await ClassService.importStudentIntoClass(req, res);
    }),
    removeStudentInClass: asyncHandler(async (req, res, next) => {
        const classes = await ClassService.removeStudentInClass(req, res, next);
        // if(role) return res.status(204).send(successResponse(204,role,{success:true}));
        // return res.status(500).send(errorResponse());
    }),
    deleteOneClass: asyncHandler(async (req, res) => {
        try {
            const classes = await ClassService.deleteOneClass(req);
            return res.status(201).send(successResponse(201, classes, "Delete Successfully"));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
        
    }),

    // Student
    getMyClass: asyncHandler(async (req, res, next) => {
        try {
            const classes = await ClassService.getMyClass(req);
            return res.status(200).send(successResponse(200, classes));
        } catch (error) {
            if (error instanceof ErrorResponse) {
                return res.status(error.statusCode).send(errorResponse(error.statusCode, error.message));
            } else {
                return res.status(500).send(errorResponse(500, error.message));
            }
        }
    }),

};
