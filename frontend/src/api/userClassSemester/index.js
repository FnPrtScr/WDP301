import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { UserClassSemester_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const userClassSemesterApi = {
  getAllLectureApi: (params, campus, semester) => requester.get(`${UserClassSemester_API.GET_MY_LECTURE_API}/${campus}/${semester}/ml`, params, config)
}

export default { userClassSemesterApi }
