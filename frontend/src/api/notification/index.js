import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { NOTIFICATION_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const notificationApi = {
  getAllNoti: (params, campus, semester) => requester.get(`${NOTIFICATION_API.GET_ALL_NOTI}/${campus}/${semester}`, params, config)
}

export default { notificationApi }
