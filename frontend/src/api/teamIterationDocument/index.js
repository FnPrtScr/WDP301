import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { TEAM_ITERATION_DOCUMENT_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const teamIterationDocumentApi = {
  //lecturer
  getAllDocumentByIterApi: (params, campus, semester, iteration_id) => requester.get(`${TEAM_ITERATION_DOCUMENT_API.GET_ALL_DOCCMENT_BY_ITER_API}/${campus}/${semester}/${iteration_id}`, params, config),
  getDocumentByTeamIDApi: (params, campus, semester, iteration_id, team_id) => requester.get(`${TEAM_ITERATION_DOCUMENT_API.GET_DOCUMENT_BY_TEAM_ID_API}/${campus}/${semester}/${iteration_id}/${team_id}`, params, config),
  //student
  submitDocumentApi: (params, campus, semester, iteration_id) => requester.post(`${TEAM_ITERATION_DOCUMENT_API.SUBMIT_DOCUMENT_API}/${campus}/${semester}/${iteration_id}`, params, config)
}

export default { teamIterationDocumentApi }