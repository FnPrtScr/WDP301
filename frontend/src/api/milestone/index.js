import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { MILESTONE_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const milestoneApi = {
  //lecture
  setDeadlineForIterationApi: (params, campus, semester, milestone_id) => requester.post(`${MILESTONE_API.SET_DEADLINE_FOR_ITERATION_API}/${campus}/${semester}/${milestone_id}`, params, config),
  getAllApi: (params, campus, semester) => requester.get(`${MILESTONE_API.GET_ALL_API}/${campus}/${semester}`, params, config),
  //student
  getAllIterationApi: (params, campus, semester) => requester.get(`${MILESTONE_API.GET_ALL_ITERATION_API}/${campus}/${semester}/s`, params, config)

}

export default { milestoneApi }
