import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { FINAL_EVALUATION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const finalEvaluationApi = {
  gradeFinalApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.post(`${FINAL_EVALUATION_API.GRADE_FINAL_API}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}`, params, config),
  getFinalGradedApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.get(`${FINAL_EVALUATION_API.GET_FINAL_GRADED_API}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}`, params, config),
  gradeFinalResitApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.post(`${FINAL_EVALUATION_API.GRADE_FINAL_Resit_API}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}/resit`, params, config),
  getFinalGradedResitApi: (params, campus, semester, iteration_id, Class_id, team_id) => requester.get(`${FINAL_EVALUATION_API.GET_FINAL_GRADED_RESIT_API}/${campus}/${semester}/${iteration_id}/${Class_id}/${team_id}/g/resit`, params, config)
}

export default { finalEvaluationApi }