import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'

const { URL_API } = AUTH

const config = {
  withCredentials: true
}

const authApi = {
  loginGoogleApi: () => requester.get(URL_API.GOOGLE_LOGIN_API),
  loginGoogleSuccessApi: () => requester.getGoogle(URL_API.GOOGLE_LOGIN_SUCCESS_API, {}, { ...config })
  //registerApi: (params) => requester.post(URL_API.REGISTER_API, params, {}),
  //forgotPasswordApi: (params) => requester.post(URL_API.FORGOT_PASSWORD_API, params, {}),
  //resetPasswordApi: (token, params) => requester.post(`${URL_API.RESET_PASSWORD_API}?token=${token}`, params, {})
}

export default { authApi }