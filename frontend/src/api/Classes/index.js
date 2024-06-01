import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { Classes_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const classesApi = {
  //head
  createOneClassesApi: (params, campus, semester) => requester.post(`${Classes_API.CREATE_ONE_ClASSES_API}/${campus}/${semester}`, params, config),
  getAllClassesApi: (params, campus, semester) => requester.get(`${Classes_API.GET_All_ClASSES_API}/${campus}/${semester}`, params, config),
  getOneClassesApi: (params, campus, semester, userId) => requester.get(`${Classes_API.GET_ONE_ClASSES_API}/${campus}/${semester}/${userId}`, params, config),
  importClassesApi: (params, campus, semester) => requester.postForm(`${Classes_API.IMPORT_CLASSES_API}/${campus}/${semester}/import`, params, config),
  updateOneClassesApi: (params, campus, semester, classesId) => requester.put(`${Classes_API.UPDATE_ONE_ClASSES_API}/${campus}/${semester}/${classesId}`, params, config),
  deleteOneClassesApi: (params, campus, semester) => requester.post(`${Classes_API.DELETE_ONE_ClASSES_API}/${campus}/${semester}/rm-class`, params, config),
  assignLecturesIntoClassApi: (params, campus, semester, classesId) => requester.post(`${Classes_API.ASSIGN_LECTURE_INTO_ClASSES_API}/${campus}/${semester}/${classesId}/assign`, params, config),
  getClassResitApi: (params, campus, semester) => requester.get(`${Classes_API.GET_ClASS_RESIT_API}/${campus}/${semester}/g/resit-final`, params, config),
  setReviewerResitApi: (params, campus, semester, classesId) => requester.post(`${Classes_API.SET_REVIEWER_RESIT_API}/${campus}/${semester}/${classesId}/c/assign-resit`, params, config),
  //lecture
  getAllMyClassApi: (params, campus, semester) => requester.get(`${Classes_API.GET_All_MY_ClASSES_API}/${campus}/${semester}/mc`, params, config),
  CreateOneStudentIntoClassApi: (params, campus, semester, class_id) => requester.post(`${Classes_API.CREATE_ONE_STUDENT_INTO_ClASSES_API}/${campus}/${semester}/${class_id}`, params, config),
  ImportStudentIntoClass: (params, campus, semester, class_id) => requester.postForm(`${Classes_API.IMPORT_STUDENT_INTO_ClASSES_API}/${campus}/${semester}/${class_id}/import`, params, config),
  RemoveStudentInClass: (params, campus, semester, class_id) => requester.post(`${Classes_API.REMOVE_STUDENT_FROM_ClASSES_API}/${campus}/${semester}/${class_id}/rm`, params, config),
  getAllStudentFromClassApi: (params, campus, semester, class_id) => requester.get(`${Classes_API.GET_All_STUDENT_FROM_ClASSES_API}/${campus}/${semester}/${class_id}`, params, config),
  createOneClassApi: (params, campus, semester) => requester.post(`${Classes_API.CREATE_ONE_ClASS_API}/${campus}/${semester}/l`, params, config),
  updateOneClassApi: (params, campus, semester, class_id) => requester.put(`${Classes_API.UPDATE_ONE_ClASS_API}/${campus}/${semester}/l/${class_id}`, params, config),
  deleteOneClassApi: (params, campus, semester, class_id) => requester.delete(`${Classes_API.DELETE_ONE_ClASS_API}/${campus}/${semester}/l/${class_id}`, params, config),
  updateStudentInMyClassApi: (params, campus, semester, class_id, student_id) => requester.put(`${Classes_API.UPDATE_STUDENT_IN_MY_CLASS}/${campus}/${semester}/${class_id}/${student_id}`, params, config),

  //student
  getMyClassApi: (params, campus, semester) => requester.get(`${Classes_API.GET_MY_CLASS_API}/${campus}/${semester}/s/mc`, params, config)
}

export default { classesApi }
