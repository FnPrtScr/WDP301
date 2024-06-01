import { lazy } from 'react'

const Project = lazy(() => import('../../views/pages/student/manage-project/index'))
const MyTeam = lazy(() => import('../../views/pages/student/my-team/index'))
const Request = lazy(() => import('../../views/pages/student/request/index'))
const MarkReport = lazy(() => import('../../views/pages/student/mark-report/index'))
const Iteration1 = lazy(() => import('../../views/pages/student/milestone/iteration1/index'))
const Iteration2 = lazy(() => import('../../views/pages/student/milestone/iteration2/index'))
const Iteration3 = lazy(() => import('../../views/pages/student/milestone/iteration3/index'))
const Iteration4 = lazy(() => import('../../views/pages/student/milestone/iteration4/index'))
const FunctionDetails = lazy(() => import('../../views/pages/student/function-requirement/index'))

const StudentRoutes = [
  {
    path: '/student/my-team',
    element: <MyTeam />
  },
  {
    path: '/student/project',
    element: <Project />
  },
  {
    path: '/student/manage-request',
    element: <Request />
  },
  {
    path: '/student/iteration1',
    element: <Iteration1 />
  },
  {
    path: '/student/iteration2',
    element: <Iteration2 />
  },
  {
    path: '/student/iteration3',
    element: <Iteration3 />
  },
  {
    path: '/student/iteration-final',
    element: <Iteration4 />
  },
  {
    path: '/student/mark-report',
    element: <MarkReport />
  },
  {
    path: '/student/manage-function/:key',
    element: <FunctionDetails />
  }
]

export default StudentRoutes
