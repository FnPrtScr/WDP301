import { lazy } from 'react'

const Statistic = lazy(() => import('../../views/pages/lecture/dashboard/index'))
const ClassesManage = lazy(() => import('../../views/pages/lecture/manage-class/index'))
const Iteration1 = lazy(() => import('../../views/pages/lecture/milestone/iteration1/index'))
const Iteration2 = lazy(() => import('../../views/pages/lecture/milestone/iteration2/index'))
const Iteration3 = lazy(() => import('../../views/pages/lecture/milestone/iteration3/index'))
const MarkReport = lazy(() => import('../../views/pages/lecture/mark-report/index'))
const Project = lazy(() => import('../../views/pages/lecture/manage-project/index'))
const ClassDetails = lazy(() => import('../../views/pages/lecture/classes/index'))
const FunctionDetails = lazy(() => import('../../views/pages/lecture/function-requirement/index'))
const FunctionRequest = lazy(() => import('../../views/pages/lecture/function-request/index'))
const Request = lazy(() => import('../../views/pages/lecture/student-request/index'))

const LectureRoutes = [
  {
    path: '/lecture/dashboard',
    element: <Statistic />
  },
  {
    path: '/lecture/class-manage',
    element: <ClassesManage />
  },
  {
    path: '/lecture/iteration1',
    element: <Iteration1 />
  },
  {
    path: '/lecture/iteration2',
    element: <Iteration2 />
  },
  {
    path: '/lecture/iteration3',
    element: <Iteration3 />
  },
  {
    path: '/lecture/mark-report',
    element: <MarkReport />
  },
  {
    path: '/lecture/project-manage',
    element: <Project />
  },
  {
    path: '/lecture/tab-class/:key',
    element: <ClassDetails />
  },
  {
    path: '/lecture/manage-function/:key',
    element: <FunctionDetails />
  },
  {
    path: '/lecture/function-requirement/:key',
    element: <FunctionRequest />
  },
  {
    path: '/lecture/student-request',
    element: <Request />
  }
]

export default LectureRoutes
