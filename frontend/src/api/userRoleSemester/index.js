import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { UserRoleSemester_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const userRoleSemesterApi = {
  getAllLectureApi: (params, campus, semester) => requester.get(`${UserRoleSemester_API.GET_All_LECTURE_API}/${campus}/${semester}/`, params, config),
  getAllLectureNotPagingApi: (params, campus, semester) => requester.get(`${UserRoleSemester_API.GET_All_LECTURE_NOT_PAGING_API}/${campus}/${semester}/l`, params, config),
  createOneApi: (params, campus, semester) => requester.post(`${UserRoleSemester_API.CREATE_ONE_API}/${campus}/${semester}`, params, config),
  importLectureApi: (params, campus, semester) => requester.postForm(`${UserRoleSemester_API.IMPORT_LECTURE_API}/${campus}/${semester}/import`, params, config),
  updateOneApi: (params, campus, semester, userId) => requester.put(`${UserRoleSemester_API.UPDATE_ONE_API}/${campus}/${semester}/${userId}`, params, config),
  deleteLectureApi: (params, campus, semester, lecturer_id) => requester.delete(`${UserRoleSemester_API.DELETE_ONE_API}/${campus}/${semester}/${lecturer_id}`, params, config)
}

export default { userRoleSemesterApi }
