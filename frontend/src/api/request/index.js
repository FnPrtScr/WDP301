import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { REQUEST_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const requestApi = {
  getRequestApi: (params, campus, semester) => requester.get(`${REQUEST_API.GET_REQUEST_API}/${campus}/${semester}`, params, config),
  createRequestApi: (params, campus, semester) => requester.postForm(`${REQUEST_API.CREATE_REQUEST_PROJECT_API}/${campus}/${semester}`, params, config),
  getRequestByStudentApi: (params, campus, semester) => requester.get(`${REQUEST_API.GET_REQUEST_API}/${campus}/${semester}/student`, params, config),
  acceptOrRejectApi: (params, campus, semester) => requester.put(`${REQUEST_API.GET_REQUEST_API}/${campus}/${semester}/aor`, params, config)

}

export default { requestApi }
