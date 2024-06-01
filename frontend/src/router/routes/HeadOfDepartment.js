import { lazy } from 'react'

const Statistic = lazy(() => import('../../views/pages/head-of-department/dashboard/index'))
const Semester = lazy(() => import('../../views/pages/head-of-department/semester/index'))
const Classes = lazy(() => import('../../views/pages/head-of-department/classes/index'))
const Lecture = lazy(() => import('../../views/pages/head-of-department/lecture/index'))
const Score = lazy(() => import('../../views/pages/head-of-department/mark-report/index'))
const Setting = lazy(() => import('../../views/pages/head-of-department/setting/index'))

const HeadOfDepartmentRoutes = [
  {
    path: '/head-of-department/dashboard',
    element: <Statistic />
  },
  {
    path: '/head-of-department/semester',
    element: <Semester />
  },
  {
    path: '/head-of-department/classes',
    element: <Classes />
  },
  {
    path: '/head-of-department/lecture',
    element: <Lecture />
  },
  {
    path: '/head-of-department/mark-report',
    element: <Score />
  },
  {
    path: '/head-of-department/setting',
    element: <Setting />
  }
]

export default HeadOfDepartmentRoutes
