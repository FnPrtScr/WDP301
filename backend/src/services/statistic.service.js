const { User, Campus, Class, Project, Team, TeamUser, TeamProject, Milestone, Iteration, Point, Semester, UserClassSemester, FunctionRequirement, Notification, UserRoleSemester, sequelize } = require('../models')
const moment = require("moment");
const { ErrorResponse } = require('../utils/response');
const Jira = require("../../configs/Jira/jira");
const { auth, sheets } = require('../../configs/Google/credentials')
const Gitlab = require('../../configs/Git/gitlab');

class StatisticService {
    // Lecturer
    async statisticJiraByTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        let arrDataIssue = [];
        let arrDataStatisticByName = [];
        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const getTeamProject = await TeamProject.findOne({
                where: {
                    team_id: team_id,
                    class_id: class_id,
                },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken']
            })
            if (!getTeamProject) throw new ErrorResponse(404, 'Team project not found');
            const host = getTeamProject.link_jira.split('/jira')[0];
            const boardId = getTeamProject.link_jira.match(/(\d+)$/)[0];
            const clientJira = Jira(host, getTeamProject.email_owner, getTeamProject.apiToken);
            const boards = await clientJira.board.getIssuesForBoard({ boardId: +boardId });
            const assigneeStats = {};
            let todoCount = 0;
            let inProgressCount = 0;
            let doneCount = 0;
            boards.issues.map((issue) => {
                const assignee = issue.fields.assignee.displayName;
                const status = issue.fields.status.name.toLowerCase();
                if (!assigneeStats[assignee]) {
                    assigneeStats[assignee] = { done: 0, todo: 0, inProgress: 0 };
                }
                switch (status) {
                    case "to do":
                        todoCount++;
                        assigneeStats[assignee].todo++;
                        break;
                    case "in progress":
                        inProgressCount++;
                        assigneeStats[assignee].inProgress++;
                        break;
                    case "done":
                        doneCount++;
                        assigneeStats[assignee].done++;
                        break;
                }
                let obj = {
                    Issue: issue.key,
                    Summary: issue.fields.summary,
                    Status: issue.fields.status.name,
                    Assignee: issue.fields.assignee.displayName,
                    Start_Date: issue.fields.created,
                    Due_Date: issue.fields.duedate
                };
                arrDataIssue.push(obj);
            });

            for (const assignee in assigneeStats) {
                let obj = {
                    assignee: assignee,
                    toDo: assigneeStats[assignee].todo,
                    inProgress: assigneeStats[assignee].inProgress,
                    done: assigneeStats[assignee].done
                };
                arrDataStatisticByName.push(obj);
            }

            const totalIssues = boards.issues.length;
            const totalToDo = todoCount;
            const totalInProgress = inProgressCount;
            const totalDone = doneCount;
            const percentDoneOnTodoInProgress = ((doneCount / (todoCount + inProgressCount)) * 100).toFixed(2);
            return { arrDataIssue, arrDataStatisticByName, totalIssues, totalToDo, totalInProgress, totalDone, percentDoneOnTodoInProgress };
        } catch (error) {
            throw error;
        }
    }

    async statisticLinkProjectTrackingByTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;

        let arrDataStatistic = [];
        let arrDataScreenFunction = [];

        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findIteration = await Iteration.findOne({ where: { iteration_id: iteration_id } });
            if (!findIteration) throw new ErrorResponse(404, 'Iteration not found')
            const getTeamProject = await TeamProject.findOne({
                where: {
                    team_id: team_id,
                    class_id: class_id,
                },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken']
            })
            if (!getTeamProject) throw new ErrorResponse(404, 'Team project not found');
            const spreadsheetId = getTeamProject.project_tracking.split('/')[5]; // https://docs.google.com/spreadsheets/d/1sFRV4Ewqlog0JgLzFJySY5HgVkwhooQmy2W_0hWB1kw/edit?usp=sharing
            // const response = await sheets.spreadsheets.get({
            //     spreadsheetId,
            //     fields: 'sheets.properties.title'
            // });
            // const sheetsData = response.data.sheets;
            // const sheetNames = sheetsData.map(sheet => sheet.properties.title);
            const sheetNames = [findIteration.name];
            await Promise.all(sheetNames.map(async (sheetName) => {
                const response = await sheets.spreadsheets.values.get({
                    spreadsheetId,
                    range: `${sheetName}!A1:Z`,
                });
                const values = response.data.values;

                if (!values || values.length < 5) {
                    throw new ErrorResponse(404, `No data found in sheet ${sheetName}`);
                }

                const columns = values[3];
                const sheetData = values.slice(4).map(row => {
                    const rowData = {};
                    row.forEach((value, index) => {
                        rowData[columns[index]] = value;
                    });
                    return rowData;
                });

                const screenFunctions = [];
                let todoCount = 0;
                let doingCount = 0;
                let doneCount = 0;
                const stats = {};

                sheetData.forEach(item => {
                    const screenFunction = item["Screen / Function"];
                    if (!screenFunctions.includes(screenFunction)) {
                        screenFunctions.push(screenFunction);
                    }

                    const status = item["Status"];
                    if (status === "To Do") {
                        todoCount++;
                    } else if (status === "Doing") {
                        doingCount++;
                    } else if (status === "Done") {
                        doneCount++;
                    }

                    const inCharge = item["In Charge"];
                    if (!stats[inCharge]) {
                        stats[inCharge] = { done: 0, todo: 0, doing: 0 };
                    }
                    if (status === "Done") {
                        stats[inCharge].done++;
                    } else if (status === "To Do") {
                        stats[inCharge].todo++;
                    } else if (status === "Doing") {
                        stats[inCharge].doing++;
                    }
                });

                let arrDataStatisticByName = [];
                for (const person in stats) {
                    let obj = {
                        assignee: person,
                        toDo: stats[person].todo,
                        inProgress: stats[person].doing,
                        done: stats[person].done
                    };
                    arrDataStatisticByName.push(obj);
                }

                const totalIssues = screenFunctions.length;

                arrDataStatistic.push({ [sheetName]: { sheetData, totalIssues, totalToDo: todoCount, totalInProgress: doingCount, totalDone: doneCount, arrDataStatisticByName } });
            }));

            return arrDataStatistic;
        } catch (error) {
            throw error;
        }
    }

    // async statisticIterationPointByTeam(req) {
    //     const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
    //     const user_id = req.user.id;
    //     try {
    //         const findIteration=await Iteration.findOne({where:{
    //             iteration_id:iteration_id,
    //             owner_id:user_id,
    //             status:true
    //         }});
    //         if(!findIteration) throw new ErrorResponse(404,'Iteration not found');
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async statisticLinkGitlabByTeam(req) {
        const { campus_id, semester_id, iteration_id, class_id, team_id } = req.params;
        const user_id = req.user.id;
        const regex = /gitlab\.com\/([^\/]+)\/([^\/]+)\/-\/(.*)/;

        try {
            const checkSemesterActive = await Semester.findOne({ where: { semester_id: semester_id, status: true } });
            if (!checkSemesterActive) throw new ErrorResponse(404, "This semester is not working")
            const findIteration = await Iteration.findOne({ where: { iteration_id: iteration_id } });
            if (!findIteration) throw new ErrorResponse(404, 'Iteration not found')
            const getTeamProject = await TeamProject.findOne({
                where: {
                    team_id: team_id,
                    class_id: class_id,
                },
                attributes: ['teamproject_id', 'team_id', 'class_id', 'project_id', 'technical', 'link_gitlab', 'tokenGit', 'link_jira', 'project_tracking', 'email_owner', 'apiToken']
            })
            if (!getTeamProject) throw new ErrorResponse(404, 'Team project not found');
            const gitlab = await Gitlab(getTeamProject.tokenGit);//https://gitlab.com/tn4490523/base-v1/-/graphs/main
            const match = getTeamProject.link_gitlab.match(regex);
            const projectId = `${match[1]}/${match[2]}`
            const branchName = match[3].split('/')[1];
            const commits = await gitlab.Commits.all(projectId, { ref_name: branchName });
            const startDate = findIteration.startDate;
            const endDate = findIteration.endDate;
            const commitsByAuthor = {};
            const suspiciousAuthors = {};

            commits.forEach(commit => {
                if (commit.author_email === commit.committer_email && commit.author_name === commit.committer_name) {
                    const authorEmail = commit.author_email;
                    const commitDate = moment(commit.authored_date).add(7, 'hours').format('YYYY-MM-DD');
                    const commitHours = moment(commit.authored_date).add(7, 'hours');

                    if (!commitsByAuthor[authorEmail]) {
                        commitsByAuthor[authorEmail] = {};
                    }
                    if (!commitsByAuthor[authorEmail][commitDate]) {
                        commitsByAuthor[authorEmail][commitDate] = 0;
                    }

                    commitsByAuthor[authorEmail][commitDate]++;

                    const commitTimes = commitsByAuthor[authorEmail];
                    const newestCommitTime = moment(commit.authored_date).add(7, 'hours');
                    const secondNewestCommitTime = Object.keys(commitTimes).length > 1 ? moment(Object.keys(commitTimes).sort().reverse()[1]) : null;

                    if (secondNewestCommitTime) {
                        const daysDifference = newestCommitTime.diff(secondNewestCommitTime, 'days');
                        if (daysDifference < -7) {
                            if (!suspiciousAuthors[authorEmail]) {
                                suspiciousAuthors[authorEmail] = [];
                            }
                            suspiciousAuthors[authorEmail].push(commitHours);
                        }
                    }
                }
            });

            Object.keys(commitsByAuthor).forEach(authorEmail => {
                Object.keys(commitsByAuthor[authorEmail]).forEach(commitDate => {
                    const commitHours = moment(commitDate + 'T00:00:00').add(7, 'hours');
                    const startDateMoment = moment(startDate, 'DD-MM-YYYY');
                    const endDateMoment = moment(endDate, 'DD-MM-YYYY');
                    if (!commitHours.isBetween(startDateMoment, endDateMoment, 'day', '[]')) {
                        delete commitsByAuthor[authorEmail][commitDate];
                    }
                });
                if (Object.keys(commitsByAuthor[authorEmail]).length === 0) {
                    delete commitsByAuthor[authorEmail];
                }
            });

            Object.keys(suspiciousAuthors).forEach(authorEmail => {
                suspiciousAuthors[authorEmail] = suspiciousAuthors[authorEmail].filter(commitHours => {
                    const startDateMoment = moment(startDate, 'DD-MM-YYYY');
                    const endDateMoment = moment(endDate, 'DD-MM-YYYY');
                    return commitHours.isBetween(startDateMoment, endDateMoment, 'day', '[]');
                });
                if (suspiciousAuthors[authorEmail].length === 0) {
                    delete suspiciousAuthors[authorEmail];
                }
            });

            return {
                commitsByAuthor: commitsByAuthor,
                suspiciousAuthors: suspiciousAuthors
            };
        } catch (error) {
            throw error;
        }
    }

    async statisticPassAndNotPass(req) {
        const { campus_id, semester_id } = req.params;
        const user_id = req.user.id;
        let arrData = [];
        try {
            const getPoint = await Point.findAll({
                where: {
                    semester_id: semester_id
                },
                include: [
                    {
                        model: User,
                        attributes: ['user_id', 'email'],
                    },
                    {
                        model: Iteration,
                        attributes: ['iteration_id', 'name']
                    },
                    {
                        model: Team,
                        attributes: ['team_id', 'name']
                    }
                ],
            })
            const studentPointsByIteration = new Map();

            getPoint.forEach(point => {
                let pointNew = 0
                const studentId = point.User.user_id;
                const studentEmail = point.User.email;
                const iterationName = point.Iteration.name;
                const gradedPoint = point.graded_point;
                const pointByLOC = point.point_by_LOC;
                if (gradedPoint && pointByLOC) {
                    pointNew = gradedPoint
                } else if (gradedPoint && !pointByLOC) {
                    pointNew = gradedPoint
                } else if (!gradedPoint && pointByLOC) {
                    pointNew = pointByLOC
                }
                if (!studentPointsByIteration.has(studentId)) {
                    studentPointsByIteration.set(studentId, {
                        'Iteration 1': null,
                        'Iteration 2': null,
                        'Iteration 3': null,
                        'Iteration 4': null,
                        email: studentEmail
                    });
                }
                const iterationMap = studentPointsByIteration.get(studentId);
                iterationMap[iterationName] = pointNew;
            });
            let belowFiveCount = 0;
            let aboveFiveCount = 0;
            studentPointsByIteration.forEach((iterationMap, studentId) => {
                const iteration1 = iterationMap['Iteration 1'] ? iterationMap['Iteration 1'] : 0;
                const iteration2 = iterationMap['Iteration 2'] ? iterationMap['Iteration 2'] : 0;
                const iteration3 = iterationMap['Iteration 3'] ? iterationMap['Iteration 3'] : 0;
                const iteration4 = iterationMap['Iteration 4'] ? iterationMap['Iteration 4'] : 0;
                const studentEmail = iterationMap.email;
                const avgFirstThree = (iteration1 * 0.15 + iteration2 * 0.2 + iteration3 * 0.25) / 0.6
                const weightedIteration4 = iteration4 * 0.4;
                const total = avgFirstThree + weightedIteration4;
                if (total < 5) {
                    belowFiveCount++;
                } else {
                    aboveFiveCount++;
                }
                // let obj = {
                //     student: {
                //         student_id: studentId,
                //         email: studentEmail 
                //     },
                //     iteration1: iteration1,
                //     iteration2: iteration2,
                //     iteration3: iteration3,
                //     iteration4: iteration4,
                //     totalFinal: +total.toFixed(2),
                // }
                // arrData.push(obj)
            });
            const totalStudents = belowFiveCount + aboveFiveCount;
            const belowFivePercentage = (belowFiveCount / totalStudents) * 100;
            const aboveFivePercentage = (aboveFiveCount / totalStudents) * 100;
            // return { arrData, belowFivePercentage, aboveFivePercentage };
            return { belowFivePercentage, aboveFivePercentage };
        } catch (error) {
            throw error;
        }
    }


}
module.exports = new StatisticService();