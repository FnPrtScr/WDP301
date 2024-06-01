import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { PROJECT_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const projectApi = {
  //LECTURER
  getAllProjectApi: (params, campus, semester) => requester.get(`${PROJECT_API.GET_All_MY_PROJECT_API}/${campus}/${semester}`, params, config),
  createOneProjectApi: (params, campus, semester) => requester.postForm(`${PROJECT_API.CREATE_ONE_PROJECT_API}/${campus}/${semester}`, params, config),
  deleteOneProjectApi: (params, campus, semester, projectId) => requester.delete(`${PROJECT_API.DELETE_ONE_PROJECT_API}/${campus}/${semester}/${projectId}`, params, config),
  updateOneProjectApi: (params, campus, semester, projectId) => requester.put(`${PROJECT_API.UPDATE_ONE_PROJECT_API}/${campus}/${semester}/${projectId}`, params, config),
  getAllProjectForRequestTopic: (params, campus, semester) => requester.get(`${PROJECT_API.GET_All_PROJECT_FOR_REQUEST_TOPIC_API}/${campus}/${semester}/st-request`, params, config),

  //STUDENT
  getMyProjectApi: (params, campus, semester) => requester.get(`${PROJECT_API.GET_MY_PROJECT_API}/${campus}/${semester}/s/mp`, params, config),
  getAllProjecFromLecturetApi: (params, campus, semester) => requester.get(`${PROJECT_API.GET_All_PROJECT_FROM_LECTURE_API}/${campus}/${semester}/s/allp`, params, config),
  //reviewer
  getAllReviewProjectApi: (params, campus, semester, iteration_id) => requester.get(`${PROJECT_API.GET_All_REVIEWER_PROJECT_API}/${campus}/${semester}/${iteration_id}/rv`, params, config)

}

export default { projectApi }
