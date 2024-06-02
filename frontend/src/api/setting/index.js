import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { SETTING_API } = AUTH

const token = Cookies.get('accessToken')

const config = `Bear ${token}`
const settingApi = {
  getOneSettingApi: () => requester.get(`${SETTING_API.GET_ONE_SETTING_API}`, {}, config),
  updateSettingApi: body => requester.put(`${SETTING_API.UPDATE_SETTING_API}/update`, body, config)
}

export default { settingApi }