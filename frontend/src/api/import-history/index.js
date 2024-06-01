import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { IMPORT_HISTORY_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const importHistoryApi = {
  getAllImportHisClassApi: (params, campus_id, semester_id) => requester.get(`${IMPORT_HISTORY_API.GET_ALL_IMPORT_HIS_CLASS_API}/${campus_id}/${semester_id}/class`, params, config),
  getAllImportHisLecturerApi: (params, campus_id, semester_id) => requester.get(`${IMPORT_HISTORY_API.GET_ALL_IMPORT_HIS_LECTURER_API}/${campus_id}/${semester_id}/lecturer`, params, config),
  getAllImportHisStudentApi: (params, campus_id, semester_id, class_id) => requester.get(`${IMPORT_HISTORY_API.GET_ALL_IMPORT_HIS_STUDENT_API}/${campus_id}/${semester_id}/student/${class_id}`, params, config)
}

export default { importHistoryApi }