import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { Team_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const teamApi = {
  getAllTeamFromClassApi: (params, campus, semester, Class_id) => requester.get(`${Team_API.GET_ALL_TEAM_FROM_CLASS}/${campus}/${semester}/${Class_id}`, params, config),
  createOneApi: (params, campus, semester, Class_id) => requester.post(`${Team_API.CREATE_ONE}/${campus}/${semester}/${Class_id}`, params, config),
  randomTeamApi: (params, campus, semester, Class_id) => requester.post(`${Team_API.RANDOM_TEAM}/${campus}/${semester}/${Class_id}/rd`, params, config),
  moveStudentIntoOtherTeamApi: (params, campus, semester, team_id, group_id) => requester.put(`${Team_API.MOVE_STUDENT_INTO_OTHER_TEAM}/${campus}/${semester}/${team_id}/${group_id}/mv`, params, config),
  removeMemberOutGroup: (params, campus, semester, Class_id, team_id, student_id) => requester.delete(`${Team_API.REMOVE_MEMBER_OUT_GROUP}/${campus}/${semester}/${Class_id}/${team_id}/${student_id}/rm`, params, config),
  addOneStudentIntoTeam: (params, campus, semester, class_id) => requester.post(`${Team_API.ADD_ONE_STUDENT_INTO_GROUP}/${campus}/${semester}/${class_id}/add`, params, config),
  removeTeamInClass: (params, campus, semester, Class_id) => requester.post(`${Team_API.REMOVE_TEAM_IN_CLASS}/${campus}/${semester}/${Class_id}/rm-t`, params, config),
  setLeaderInTeam: (params, campus, semester, class_id, team_id) => requester.post(`${Team_API.SET_LEADER_IN_TEAM}/${campus}/${semester}/${class_id}/${team_id}`, params, config),
  getMyTeamApi: (params, campus, semester) => requester.get(`${Team_API.GET_MY_TEAM}/${campus}/${semester}/s/mt`, params, config)
}

export default { teamApi }