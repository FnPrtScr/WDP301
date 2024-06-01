import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { POINT_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const pointApi = {
  //head
  getTopTeamByClassApi: (params, campus, semester) => requester.get(`${POINT_API.GET_TOP_TEAM_BY_CLASS}/${campus}/${semester}`, params, config),
  //lecturer
  //gradePointAutoByTeamApi: (params, campus, semester, iteration_id, team_id) => requester.post(`${POINT_API.GRADE_POINT_AUTO_BY_TEAM}/${campus}/${semester}/${iteration_id}/${team_id}/auto`, params, config),
  getPointByTeamApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.get(`${POINT_API.GET_POINT_BY_TEAM}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}`, params, config),
  gradePointManualByStudentApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.post(`${POINT_API.GRADE_POINT_MANUAL_BY_STUDENT}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}/manual`, params, config),
  //updatePointByStudentApi: (params, campus, semester, iteration_id, Class_id, team_id, point_id) => requester.put(`${POINT_API.UPDATE_POINT_BY_STUDENT}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}/${point_id}`, params, config)
  getPointByClassApi: (params, campus, semester, Class_id) => requester.get(`${POINT_API.GET_POINT_BY_CLASS}/${campus}/${semester}/${Class_id}`, params, config),

  //student
  getMyPointApi: (params, campus, semester) => requester.get(`${POINT_API.GET_MY_POINT}/${campus}/${semester}/st/my-point`, params, config),
  getMyPointByIterationApi: (params, campus, semester, iteration_id) => requester.get(`${POINT_API.GET_MY_POINT_BY_ITERATION}/${campus}/${semester}/${iteration_id}/p/st/report-LOC`, params, config)
}

export default { pointApi }