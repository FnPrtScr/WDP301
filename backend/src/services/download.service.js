const { Op, Sequelize } = require('sequelize');
const { Campus, FinalEvaluation, Team, User, Iteration, Class, sequelize } = require('../models');
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const RedisService = require('../services/redis.service');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

class DownloadService {
    async downloadExcel(req, res) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const { type } = req.query;
        const user_id = req.user.id;

        try {
            const getLectureInClass = await Class.findOne({
                where: {
                    class_id: class_id,
                },
                attributes: ['class_id', 'user_id'],
                include: [
                    {
                        model: User,
                        as: 'Lecture',
                        attributes: ['user_id', 'email', 'campus_id', 'first_name', 'last_name'],
                    }
                ]
            })
            const checkIteration = await Iteration.findOne({
                where: {
                    milestone_id: iteration_id,
                    name: {
                        [Op.like]: "Iteration 4"
                    },
                    owner_id: getLectureInClass.Lecture.user_id

                }
            })
            if (!checkIteration) throw new ErrorResponse(404, "Iteration not found")
            if (+type === 1) { // my grade
                const workbook = XLSX.utils.book_new();
                const keys = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:graded:*`;
                const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
                await Promise.all(getKeys.map(async (key) => {
                    const getGradedE = await RedisService.hgetall({ ...req, body: { key: key } });
                    const keyComment = key.replace("graded", "comments");
                    const getComment = await RedisService.hgetall({ ...req, body: { key: keyComment } });
                    const selectedFields = ['project_introduction', 'software_requirement', 'software_design', 'implementation', 'question_and_answer'];
                    const getMyGradedFinalE = { ...getGradedE, datas: JSON.parse(getGradedE.datas) };
                    const worksheet = XLSX.utils.json_to_sheet(await this.processDataForExcel(getMyGradedFinalE.datas, +type));
                    const dataArray = selectedFields.map(field => getComment[field]);
                    const lastRow = worksheet['!ref'].split(':')[1].replace(/\D/g, '');
                    const arrComment = [
                        dataArray[0],
                        dataArray[1],
                        dataArray[2],
                        dataArray[3],
                        dataArray[4]
                    ];
                    arrComment.forEach((comment, colIndex) => {
                        const rowIndex = lastRow - 1;
                        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex + 2 }); // Bắt đầu từ cột C
                        worksheet[cellAddress] = { t: 's', v: comment.toString() }; // Thiết lập giá trị cell
                    });
                    worksheet['!rows'] = worksheet['!rows'] || [];
                    worksheet['!cols'] = worksheet['!cols'] || [];
                    for (let index = 0; index < 7; index++) {
                        if (index === 0) {
                            worksheet['!cols'][index] = { width: 20 };
                        } else if (index === 1) {
                            worksheet['!cols'][index] = { width: 30 };
                        } else {
                            worksheet['!cols'][index] = { width: 25 };
                        }
                    }
                    worksheet['!rows'][0] = { hpx: 20 };
                    worksheet['!rows'][lastRow - 1] = { hpx: 50 };
                    XLSX.utils.book_append_sheet(workbook, worksheet, `${getGradedE.reviewer}`);
                }))
                const fileName = `${Date.now()}-TeamGrades_${campus_id}_${semester_id}_${checkIteration.iteration_id}_${class_id}_${team_id}.xlsx`;
                const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'uploads', `${fileName}`);
                try {
                    XLSX.writeFile(workbook, filePath);
                    await res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
                    await res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    await res.sendFile(filePath, () => {
                        fs.unlinkSync(filePath);
                    });
                } catch (error) {
                    throw error;
                }
            } else if (+type === 2) { //total grade
                const getGradedInSystem = await FinalEvaluation.findAll({
                    where: {
                        team_id: team_id,
                        iteration_id: +checkIteration.iteration_id,
                        xnd_review:1
                    },
                    include: [
                        {
                            model: User,
                            as: 'Student',
                            attributes: ['email'],
                        }
                    ]
                });
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(await this.processDataForExcel(getGradedInSystem, +type));

                const keys = `${campus_id}:${semester_id}:finalE:${class_id}:${team_id}:comments:*`;
                const getKeys = await RedisService.keys({ ...req, body: { pattern: keys } });
                // const lastRow = worksheet['!ref'].split(':')[1].replace(/\D/g, '');
                let dataArray = [];

                await Promise.all(getKeys.map(async (key) => {
                    const getComment = await RedisService.hgetall({ ...req, body: { key: key } });
                    const selectedFields = ['reviewer', 'project_introduction', 'software_requirement', 'software_design', 'implementation', 'question_and_answer'];
                    const commentData = selectedFields.map(field => getComment[field]);
                    dataArray.push(commentData);
                }));
                for (let index = 0; index < dataArray.length; index++) {
                    const arrComment = [
                        dataArray[index][0],
                        dataArray[index][1],
                        dataArray[index][2],
                        dataArray[index][3],
                        dataArray[index][4],
                        dataArray[index][5],
                    ]
                    arrComment.forEach((comment, colIndex) => {
                        let lastRow = worksheet['!ref'].split(':')[1].replace(/\D/g, '');
                        const rowIndex = parseInt(lastRow) - 1;
                        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex + 1 }); // Bắt đầu từ cột C
                        worksheet[cellAddress] = { t: 's', v: comment ,}; // Thiết lập giá trị cell
                    });
                }

                worksheet['!rows'] = worksheet['!rows'] || [];
                worksheet['!cols'] = worksheet['!cols'] || [];
                for (let index = 0; index < 7; index++) {
                    if (index === 0) {
                        worksheet['!cols'][index] = { width: 20 };
                    } else if (index === 1) {
                        worksheet['!cols'][index] = { width: 30 };
                    } else {
                        worksheet['!cols'][index] = { width: 25 };
                    }
                }
                worksheet['!rows'][0] = { hpx: 20 };
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Team Grades');
                const fileName = `${Date.now()}-TeamGradedFinal_${campus_id}_${semester_id}_${checkIteration.iteration_id}_${class_id}_${team_id}.xlsx`;
                const filePath = path.join(__dirname, '..', '..', 'public', 'assets', 'uploads', `${fileName}`);
                try {
                    await XLSX.writeFile(workbook, filePath);
                    await res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
                    await res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    await res.sendFile(filePath, () => {
                        fs.unlinkSync(filePath);
                    });
                } catch (error) {
                    throw error;
                }
            }
        } catch (error) {
            throw error
        }
    }

    async processDataForExcel(gradedFinalEData, type) {
        const processedData = [];
        if (+type === 1) {
            for (const studentData of gradedFinalEData) {
                const studentRow = {
                    'Student ID': studentData.student_id.student_id ?? '',
                    'Email': studentData.student_id.email ?? '',
                    'Project Introduction(10%)': studentData.project_introduction ?? '',
                    'Software Requirement(20%)': studentData.software_requirement ?? '',
                    'Software Design(20%)': studentData.software_design ?? '',
                    'Implementation(40%)': studentData.implementation ?? '',
                    'Question Answer(10%)': studentData.question_answer ?? '',
                };
                processedData.push(studentRow);
            }
            let obj = {
                '': '',
                'Email': 'Comment',
                'Project Introduction(10%)': 'nothing',
                'Software Requirement(20%)': 'nothing',
                'Software Design(20%)': 'nothing',
                'Implementation(40%)': 'nothing',
                'Question Answer(10%)': 'nothing',
            };
            processedData.push(obj)
        }
        else if (+type === 2) {
            for (const studentData of gradedFinalEData) {
                const studentRow = {
                    'Student ID': studentData.student_id,
                    'Email': studentData.Student.email,
                    'Project Introduction(10%)': studentData.project_introduction,
                    'Software Requirement(20%)': studentData.software_requirement,
                    'Software Design(20%)': studentData.software_design,
                    'Implementation(40%)': studentData.implementation,
                    'Question Answer(10%)': studentData.question_answer,
                };
                processedData.push(studentRow);
            }
            let obj = {
                'Student ID': 'Reviewer',
                'Email': 'nothing',
                'Project Introduction(10%)': 'nothing',
                'Software Requirement(20%)': 'nothing',
                'Software Design(20%)': 'nothing',
                'Implementation(40%)': 'nothing',
                'Question Answer(10%)': 'nothing',
            };
            processedData.push(obj)
        }
        return processedData;
    }
}

module.exports = new DownloadService();
