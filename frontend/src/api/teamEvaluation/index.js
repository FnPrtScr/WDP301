import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { TEAM_EVALUATION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const teamEvaluationApi = {
  //lecturer
  gradeTeamApi: (params, campus_id, semester_id, iteration_id, Class_id, team_id) => requester.post(`${TEAM_EVALUATION_API.GRADE_TEAM_API}/${campus_id}/${semester_id}/${iteration_id}/${Class_id}/${team_id}`, params, config),
  getGradeTeamApi: (params, campus_id, semester_id, iteration_id, Class_id, team_id) => requester.get(`${TEAM_EVALUATION_API.GRADE_TEAM_API}/${campus_id}/${semester_id}/${iteration_id}/${Class_id}/${team_id}`, params, config)
}

export default { teamEvaluationApi }