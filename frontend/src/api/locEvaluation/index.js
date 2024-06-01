import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { LOC_EVALUATION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const LocEvaluationApi = {
  //lecture
  gradeForStudentApi: (params, campus_id, semester_id, iteration_id, class_id, team_id) => requester.post(`${LOC_EVALUATION_API.GRADE_FOR_STUDENT_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/${team_id}`, params, config),
  getFunctionRequirementScoringApi: (params, campus_id, semester_id, iteration_id, class_id, team_id) => requester.get(`${LOC_EVALUATION_API.GET_FUNCTION_REQUIREMENT_SCORING_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/${team_id}`, params, config),
  getFunctionRequirementGradedApi: (params, campus_id, semester_id, iteration_id, class_id, team_id) => requester.get(`${LOC_EVALUATION_API.GET_FUNCTION_REQUIREMENT_GRADE_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/${team_id}/graded`, params, config),
  getTotalLOCApi: (params, campus_id, semester_id, iteration_id, class_id, team_id) => requester.get(`${LOC_EVALUATION_API.GET_TOTAL_LOC_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/${team_id}/total-LOC`, params, config),
  checkConditionPresentApi: (params, campus_id, semester_id, iteration_id, class_id, team_id) => requester.get(`${LOC_EVALUATION_API.GET_CHECK_CONDITION_PRESENT_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/${team_id}/check-present`, params, config)

}

export default { LocEvaluationApi }
