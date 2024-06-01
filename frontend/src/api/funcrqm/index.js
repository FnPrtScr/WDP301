import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { FUNCTION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const funcrmApi = {
  //lecture
  CreateOneFunctionApi: (params, campus, semester, project_id) => requester.post(`${FUNCTION_API.CREATE_ONE_FUNCTION_API}/${campus}/${semester}/${project_id}`, params, config),
  UpdateOneFunctionApi: (params, campus, semester, project_id, fcrqm_id) => requester.put(`${FUNCTION_API.UPDATE_ONE_FUNCTION_API}/${campus}/${semester}/${project_id}/${fcrqm_id}`, params, config),
  RemoveFunctionApi: (params, campus, semester, project_id, fcrqm_id) => requester.delete(`${FUNCTION_API.DELETE_ONE_FUNCTION_API}/${campus}/${semester}/${project_id}/${fcrqm_id}`, params, config),
  getAllFunctionApi: (params, campus, semester, project_id) => requester.get(`${FUNCTION_API.GET_FUNCTION_IN_PROJECT_API}/${campus}/${semester}/${project_id}`, params, config),
  //student
  getAllFunctionByStudentApi: (params, campus, semester, project_id) => requester.get(`${FUNCTION_API.GET_ALL_FUNCTION_BY_STUDENT_API}/${campus}/${semester}/s/${project_id}`, params, config)

}

export default { funcrmApi }
