import requester from '../requester'
import { AUTH } from '../constants'
//import { IPagingParams, I } from '@src/domain/models/I'
import Cookies from 'js-cookie'
const { STATISTIC_API } = AUTH

const token = Cookies.get('accessToken')
const config = `Bear ${token}`
const statisticApi = {
  //head
  getStatisticPassAndNotPassApi: (params, campus, semester) => requester.get(`${STATISTIC_API.STATISTIC_PASS_AND_NOTPASS_API}/${campus}/${semester}`, params, config),
  //lecturer
  getStatisticJiraByTeamApi: (params, campus, semester, iteration_id, class_id, team_id) => requester.get(`${STATISTIC_API.STATISTIC_JIRA_BY_TEAM_API}/${campus}/${semester}/${iteration_id}/${class_id}/${team_id}/jira`, params, config),
  getStatisticLinkProjectTrackingByTeam: (params, campus, semester, class_id, iteration_id, team_id) => requester.get(`${STATISTIC_API.STATISTIC_LINK_PROJECT_TRACKING_BY_TEAM_API}/${campus}/${semester}/${class_id}/${iteration_id}/${team_id}/project-tracking`, params, config),
  getStatisticLinkGitlabByTeam: (params, campus, semester, class_id, iteration_id, team_id) => requester.get(`${STATISTIC_API.STATISTIC_LINK_GITLAB_BY_TEAM_API}/${campus}/${semester}/${class_id}/${iteration_id}/${team_id}/gitlab`, params, config)
}

export default { statisticApi }