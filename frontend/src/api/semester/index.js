import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { SEMESTER_API } = AUTH

const token = Cookies.get('accessToken')

const config = `Bear ${token}`
const semesterApi = {
  getAllsemesterApi: (params) => requester.get(`${SEMESTER_API.GET_SEMESTER_API}`, params, config),
  createSemesterApi: (params, campus_id) => requester.post(`${SEMESTER_API.CREATE_SEMESTER_API}/${campus_id}/c`, params, config),
  getPaggingSemesterApi: (params, campus_id) => requester.get(`${SEMESTER_API.GET_PAGGING_SEMESTER_API}/${campus_id}`, params, config),
  updateSemesterApi: (params, campus_id, semester_id) => requester.put(`${SEMESTER_API.UPDATE_SEMESTER_API}/${campus_id}/${semester_id}`, params, config),
  deleteSemesterApi: (params, campus_id, semester_id) => requester.delete(`${SEMESTER_API.DELETE_SEMESTER_API}/${campus_id}/${semester_id}`, params, config),
  changeStatusApi: (params, campus_id, semester_id) => requester.delete(`${SEMESTER_API.CHANGE_STATUS_API}/${campus_id}/${semester_id}/change`, params, config),
  getDeadlineSemesterApi: (params, campus_id, semester_id) => requester.get(`${SEMESTER_API.GET_DEADLINE_SEMESTER_API}/${campus_id}/${semester_id}/deadline`, params, config)
}

export default { semesterApi }