import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { TEAM_PROJECT_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`

const teamProjectApi = {
  getAllTeamProject: (params, campus, semester) => requester.get(`${TEAM_PROJECT_API.GET_All_TEAM_PROJECT_API}/${campus}/${semester}`, params, config),
  AsignProjectApi: (params, campus, semester) => requester.post(`${TEAM_PROJECT_API.ASIGN_PROJECT_API}/${campus}/${semester}/assign`, params, config),
  deleteTeamProjectApi: (params, campus, semester, projectId) => requester.delete(`${TEAM_PROJECT_API.DELETE_TEAM_PROJECT_API}/${campus}/${semester}/${projectId}`, params, config),
  updateTeamProjectApi: (params, campus, semester, teamproject_id) => requester.put(`${TEAM_PROJECT_API.UPDATE_TEAM_PROJECT_API}/${campus}/${semester}/${teamproject_id}`, params, config),
  AddLinkAndTechApi: (params, campus, semester, teamproject_id) => requester.put(`${TEAM_PROJECT_API.ADD_LINK_TEAM_PROJECT_API}/${campus}/${semester}/s/${teamproject_id}`, params, config),
  getProjectByTeamId: (params, campus, semester, class_id, team_id) => requester.get(`${TEAM_PROJECT_API.GET_PROJECT_BY_TEAM_ID_API}/${campus}/${semester}/${class_id}/${team_id}`, params, config)
}

export default { teamProjectApi }
