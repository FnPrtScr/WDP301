import { PUBLIC_URL_SERVER_API } from "../dataConfig"

export const BASE_URL = PUBLIC_URL_SERVER_API

export const AUTH = {
  NOTIFICATION_API: {
    GET_ALL_NOTI: `${BASE_URL}/noti`
  },
  URL_API: {
    GOOGLE_LOGIN_API: `${BASE_URL}/auth/google`,
    GOOGLE_LOGIN_SUCCESS_API: `${BASE_URL}/auth/login/success`
  },
  CAMPUS_API: {
    GET_CAMPUS_API: `${BASE_URL}/campus/`
  },
  SETTING_API: {
    UPDATE_SETTING_API: `${BASE_URL}/setting`,
    GET_ONE_SETTING_API: `${BASE_URL}/setting`
  },
  SEMESTER_API: {
    GET_SEMESTER_API: `${BASE_URL}/semester/g`,
    GET_DEADLINE_SEMESTER_API: `${BASE_URL}/semester`,
    CREATE_SEMESTER_API: `${BASE_URL}/semester`,
    GET_PAGGING_SEMESTER_API: `${BASE_URL}/semester`,
    UPDATE_SEMESTER_API: `${BASE_URL}/semester`,
    DELETE_SEMESTER_API: `${BASE_URL}/semester`,
    CHANGE_STATUS_API: `${BASE_URL}/semester`
  },
  UserRoleSemester_API: {
    GET_All_LECTURE_API: `${BASE_URL}/urs`,
    GET_All_LECTURE_NOT_PAGING_API: `${BASE_URL}/urs`,
    CREATE_ONE_API: `${BASE_URL}/urs`,
    IMPORT_LECTURE_API: `${BASE_URL}/urs`,
    UPDATE_ONE_API: `${BASE_URL}/urs`,
    DELETE_ONE_API: `${BASE_URL}/urs`
  },
  UserClassSemester_API: {
    GET_MY_LECTURE_API: `${BASE_URL}/ucs`
  },
  Classes_API: {
    //head
    GET_All_ClASSES_API: `${BASE_URL}/class`,
    CREATE_ONE_ClASSES_API: `${BASE_URL}/class`,
    GET_ONE_ClASSES_API: `${BASE_URL}/class`,
    IMPORT_CLASSES_API: `${BASE_URL}/class`,
    UPDATE_ONE_ClASSES_API: `${BASE_URL}/class`,
    DELETE_ONE_ClASSES_API: `${BASE_URL}/class`,
    ASSIGN_LECTURE_INTO_ClASSES_API: `${BASE_URL}/class`,
    GET_ClASS_RESIT_API: `${BASE_URL}/class`,
    SET_REVIEWER_RESIT_API: `${BASE_URL}/class`,
    //lecture
    GET_All_MY_ClASSES_API: `${BASE_URL}/class`,
    CREATE_ONE_STUDENT_INTO_ClASSES_API: `${BASE_URL}/class`,
    IMPORT_STUDENT_INTO_ClASSES_API: `${BASE_URL}/class`,
    REMOVE_STUDENT_FROM_ClASSES_API: `${BASE_URL}/class`,
    GET_All_STUDENT_FROM_ClASSES_API: `${BASE_URL}/class`,
    CREATE_ONE_ClASS_API: `${BASE_URL}/class`,
    UPDATE_ONE_ClASS_API: `${BASE_URL}/class`,
    DELETE_ONE_ClASS_API: `${BASE_URL}/class`,
    UPDATE_STUDENT_IN_MY_CLASS: `${BASE_URL}/class`,
    //student
    GET_MY_CLASS_API: `${BASE_URL}/class`
  },
  Team_API: {
    GET_ALL_TEAM_FROM_CLASS: `${BASE_URL}/team`,
    CREATE_ONE: `${BASE_URL}/team`,
    RANDOM_TEAM: `${BASE_URL}/team`,
    MOVE_STUDENT_INTO_OTHER_TEAM: `${BASE_URL}/team`,
    REMOVE_MEMBER_OUT_GROUP: `${BASE_URL}/team`,
    ADD_ONE_STUDENT_INTO_GROUP: `${BASE_URL}/team`,
    REMOVE_TEAM_IN_CLASS: `${BASE_URL}/team`,
    SET_LEADER_IN_TEAM: `${BASE_URL}/team`,
    GET_MY_TEAM: `${BASE_URL}/team`
  },
  PROJECT_API: {
    GET_All_MY_PROJECT_API: `${BASE_URL}/project`,
    CREATE_ONE_PROJECT_API: `${BASE_URL}/project`,
    DELETE_ONE_PROJECT_API: `${BASE_URL}/project`,
    UPDATE_ONE_PROJECT_API: `${BASE_URL}/project`,
    GET_All_PROJECT_FOR_REQUEST_TOPIC_API: `${BASE_URL}/project`,
    //STUDENT
    GET_MY_PROJECT_API: `${BASE_URL}/project`,
    GET_All_PROJECT_FROM_LECTURE_API: `${BASE_URL}/project`,
    //reviewer
    GET_All_REVIEWER_PROJECT_API: `${BASE_URL}/project`
  },
  TEAM_PROJECT_API: {
    GET_All_TEAM_PROJECT_API: `${BASE_URL}/teamproject`,
    ASIGN_PROJECT_API: `${BASE_URL}/teamproject`,
    DELETE_TEAM_PROJECT_API: `${BASE_URL}/teamproject`,
    UPDATE_TEAM_PROJECT_API: `${BASE_URL}/teamproject`,
    ADD_LINK_TEAM_PROJECT_API: `${BASE_URL}/teamproject`,
    GET_PROJECT_BY_TEAM_ID_API: `${BASE_URL}/teamproject`
  },
  FUNCTION_API: {
    GET_FUNCTION_IN_PROJECT_API: `${BASE_URL}/fcrqm`,
    CREATE_ONE_FUNCTION_API: `${BASE_URL}/fcrqm`,
    UPDATE_ONE_FUNCTION_API: `${BASE_URL}/fcrqm`,
    DELETE_ONE_FUNCTION_API: `${BASE_URL}/fcrqm`,
    GET_ALL_FUNCTION_BY_STUDENT_API: `${BASE_URL}/fcrqm`
  },
  MILESTONE_API: {
    GET_ALL_API: `${BASE_URL}/milestone`,
    GET_ALL_ITERATION_API: `${BASE_URL}/milestone`
  },
  ITERATION_API: {
    SET_DEADLINE_FOR_ITERATION_API: `${BASE_URL}/iteration`,
    SETTING_ITERATION_API: `${BASE_URL}/iteration`,
    GET_DEADLINE_API: `${BASE_URL}/iteration`,
    SET_COMPLETED_ITERATION_API: `${BASE_URL}/iteration`

  },
  ITERATION_DOCUMENT_API: {
    SUBMIT_DOCUMENT_API: `${BASE_URL}/t-iter-doc`,
    GET_DOCUMENT_MY_TEAM_API: `${BASE_URL}/t-iter-doc`
  },

  LOC_EVALUATION_API: {
    GRADE_FOR_STUDENT_API: `${BASE_URL}/loc-e`,
    GET_FUNCTION_REQUIREMENT_SCORING_API: `${BASE_URL}/loc-e`,
    GET_FUNCTION_REQUIREMENT_GRADE_API: `${BASE_URL}/loc-e`,
    GET_TOTAL_LOC_API: `${BASE_URL}/loc-e`,
    GET_CHECK_CONDITION_PRESENT_API: `${BASE_URL}/loc-e`

  },
  TEAM_ITERATION_DOCUMENT_API: {
    //LECTURE
    GET_ALL_DOCCMENT_BY_ITER_API: `${BASE_URL}/t-iter-doc`,
    GET_DOCUMENT_BY_TEAM_ID_API: `${BASE_URL}/t-iter-doc`,
    //STUDENT
    SUBMIT_DOCUMENT_API: `${BASE_URL}/t-iter-doc`
  },
  TEAM_EVALUATION_API: {
    //LECTURE
    GRADE_TEAM_API: `${BASE_URL}/team-e`
  },
  STATISTIC_API: {
    STATISTIC_JIRA_BY_TEAM_API: `${BASE_URL}/statistic`,
    STATISTIC_PASS_AND_NOTPASS_API: `${BASE_URL}/statistic`,
    STATISTIC_LINK_PROJECT_TRACKING_BY_TEAM_API: `${BASE_URL}/statistic`,
    STATISTIC_LINK_GITLAB_BY_TEAM_API: `${BASE_URL}/statistic`
  },
  POINT_API: {
    GRADE_POINT_AUTO_BY_TEAM: `${BASE_URL}/point`,
    GET_POINT_BY_TEAM: `${BASE_URL}/point`,
    GET_POINT_BY_CLASS: `${BASE_URL}/point`,
    GRADE_POINT_MANUAL_BY_STUDENT: `${BASE_URL}/point`,
    UPDATE_POINT_BY_STUDENT: `${BASE_URL}/point`,
    GET_MY_POINT: `${BASE_URL}/point`,
    GET_MY_POINT_BY_ITERATION: `${BASE_URL}/point`,
    GET_TOP_TEAM_BY_CLASS: `${BASE_URL}/point`
  },
  REQUEST_API: {
    GET_REQUEST_API: `${BASE_URL}/request`,
    CREATE_REQUEST_PROJECT_API: `${BASE_URL}/request`,
    GET_REQUEST_BY_STUDENT_API: `${BASE_URL}/request`,
    ACCEPT_OR_REJECT_REQUEST_API: `${BASE_URL}/request`
  },
  FINAL_EVALUATION_API: {
    //REVIEWER
    GRADE_FINAL_API: `${BASE_URL}/final-e`,
    GRADE_FINAL_Resit_API: `${BASE_URL}/final-e`,
    GET_FINAL_GRADED_API: `${BASE_URL}/final-e`,
    GET_FINAL_GRADED_RESIT_API: `${BASE_URL}/final-e`
  },
  IMPORT_HISTORY_API: {
    //HEAD
    GET_ALL_IMPORT_HIS_CLASS_API: `${BASE_URL}/import-history`,
    GET_ALL_IMPORT_HIS_LECTURER_API: `${BASE_URL}/import-history`,
    //LECTURER
    GET_ALL_IMPORT_HIS_STUDENT_API: `${BASE_URL}/import-history`
  },
  User_API: {
    //HEAD
    GET_MY_PROFILE_API: `${BASE_URL}/user/my-profile`
  }
}