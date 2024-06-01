import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'

const { CAMPUS_API } = AUTH


const campusApi = {
  getAllCampusApi: (params) => requester.get(CAMPUS_API.GET_CAMPUS_API, params, {})
  //registerApi: (params) => requester.post(URL_API.REGISTER_API, params, {}),
  //forgotPasswordApi: (params) => requester.post(URL_API.FORGOT_PASSWORD_API, params, {}),
  //resetPasswordApi: (token, params) => requester.post(`${URL_API.RESET_PASSWORD_API}?token=${token}`, params, {})
}

export default { campusApi }