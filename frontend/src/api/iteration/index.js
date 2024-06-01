import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { ITERATION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const iterationApi = {
  //lecture
  setDeadlineForIterationApi: (params, campus_id, semester_id, milestone_id, class_id) => requester.post(`${ITERATION_API.SET_DEADLINE_FOR_ITERATION_API}/${campus_id}/${semester_id}/${milestone_id}/${class_id}`, params, config),
  settingIterationApi: (params, campus_id, semester_id, iteration_id, class_id) => requester.post(`${ITERATION_API.SETTING_ITERATION_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/st`, params, config),
  getDeadlineApi: (params, campus_id, semester_id, milestone_id, class_id) => requester.get(`${ITERATION_API.GET_DEADLINE_API}/${campus_id}/${semester_id}/${milestone_id}/${class_id}`, params, config),
  getSettingApi: (params, campus_id, semester_id, iteration_id, class_id) => requester.get(`${ITERATION_API.GET_DEADLINE_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/get-st`, params, config),
  setCompletedIterationApi: (params, campus_id, semester_id, iteration_id, class_id) => requester.post(`${ITERATION_API.SET_COMPLETED_ITERATION_API}/${campus_id}/${semester_id}/${iteration_id}/${class_id}/st/completed`, params, config),

  // student
  getDeadlineRoleStudent: (params, campus_id, semester_id, milestone_id) => requester.get(`${ITERATION_API.GET_DEADLINE_API}/${campus_id}/${semester_id}/${milestone_id}/st/get-dl`, params, config)
}

export default { iterationApi }
