import authApi from './auth'
import campusApi from './campus'
import semesterApi from './semester'
import settingApi from './setting'
import userRoleSemesterApi from './userRoleSemester'
import userClassSemesterApi from './userClassSemester'
import classesApi from './Classes'
import teamApi from './team'
import projectApi from './project'
import funcrmApi from './funcrqm'
import teamProjectApi from './teamProject'
import milestoneApi from './milestone'
import interation from './iteration'
import interationDocument from './iteration-document'
import locEvaluation from './locEvaluation'
import teamIterationDocumentApi from './teamIterationDocument'
import teamEvaluationApi from './teamEvaluation'
import requestApi from './request'
import statisticApi from './statistic'
import pointApi from './point'
import finalEvaluationApi from './final-evaluation'
import notificationApi from './notification'
import importHistoryApi from './import-history'
import userApi from './user'
import chatGroupApi from './chatGroup'
const api = {
  ...authApi,
  ...campusApi,
  ...semesterApi,
  ...settingApi,
  ...userRoleSemesterApi,
  ...userClassSemesterApi,
  ...classesApi,
  ...teamApi,
  ...projectApi,
  ...funcrmApi,
  ...milestoneApi,
  ...teamProjectApi,
  ...interation,
  ...teamIterationDocumentApi,
  ...teamEvaluationApi,
  ...interationDocument,
  ...locEvaluation,
  ...requestApi,
  ...statisticApi,
  ...pointApi,
  ...finalEvaluationApi,
  ...notificationApi,
  ...importHistoryApi,
  ...userApi,
  ...chatGroupApi
}
export default api