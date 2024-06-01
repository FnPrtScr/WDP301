import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { User_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const userApi = {
  getMyProfileApi: (params) => requester.get(`${User_API.GET_MY_PROFILE_API}`, params, config)
}

export default { userApi }
