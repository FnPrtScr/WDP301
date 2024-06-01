import { lazy } from 'react'

const IterationFinal = lazy(() => import('../../views/pages/reviewer/milestone/iteration-final/index'))
const IterationFinalResit = lazy(() => import('../../views/pages/reviewer/milestone/iteration-final-resit/index'))

const StudentRoutes = [
  {
    path: '/reviewer/iteration-final',
    element: <IterationFinal />
  }, {
    path: '/reviewer/iteration-final-resit',
    element: <IterationFinalResit />
  }
]

export default StudentRoutes
