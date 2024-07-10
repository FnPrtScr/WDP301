import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { CHAT_GROUP_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const chatGroupApi = {
  getAllChatGroup: (params, campus, semester) => requester.get(`${CHAT_GROUP_API.GET_ALL_CHAT_GROUP_API}/${campus}/${semester}`, params, config),
  getChat: (params, campus, semester, chatGroupId) => requester.get(`${CHAT_GROUP_API.GET_ALL_CHAT_GROUP_API}/${campus}/${semester}/${chatGroupId}`, params, config),
  createMessage: (params, campus, semester, chatGroupId) => requester.post(`${CHAT_GROUP_API.GET_ALL_CHAT_GROUP_API}/${campus}/${semester}/${chatGroupId}`, params, config)
}

export default { chatGroupApi }
