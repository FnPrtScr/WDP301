import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { ITERATION_DOCUMENT_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const iterDocumenttApi = {
  getDocumentMyTeamApi: (params, campus, semester, iterId) => requester.get(`${ITERATION_DOCUMENT_API.GET_DOCUMENT_MY_TEAM_API}/${campus}/${semester}/${iterId}/st/md`, params, config),
  submitDocumentApi: (params, campus, semester, iteration_id) => requester.post(`${ITERATION_DOCUMENT_API.SUBMIT_DOCUMENT_API}/${campus}/${semester}/${iteration_id}/submit`, params, config)

}

export default { iterDocumenttApi }
