import { lazy } from 'react'

const Reactstrap = lazy(() => import('../../views/tables/reactstrap'))
const DTBasic = lazy(() => import('../../views/tables/data-tables/basic'))
const DTAdvance = lazy(() => import('../../views/tables/data-tables/advance'))
const TablesRoutes = [
  {
    path: '/tables/reactstrap',
    element: <Reactstrap />
  },
  {
    path: '/datatables/basic',
    element: <DTBasic />
  },
  {
    path: '/datatables/advance',
    element: <DTAdvance />
  }
  //{
  //  path: '/head-of-department/dashboard',
  //  //meta: {
  //  //  layout: 'blank',
  //  //  publicRoute: true,
  //  //  restricted: true
  //  //},
  //  element: <Statistic />
  //},
  //{
  //  path: '/head-of-department/semester',
  //  element: <Semester />
  //},
  //{
  //  path: '/head-of-department/classes',
  //  element: <Classes />
  //},
  //{
  //  path: '/head-of-department/lecture',
  //  element: <Lecture />
  //},
  //{
  //  path: '/head-of-department/score',
  //  element: <Score />
  //}
]

export default TablesRoutes
