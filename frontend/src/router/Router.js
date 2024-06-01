// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@layouts/VerticalLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser, getSelectedRole } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Components
const Error = lazy(() => import('../views/pages/misc/Error'))
//const Login = lazy(() => import('../views/pages/authentication/Login'))
const Login = lazy(() => import('../views/pages/login/LandingPage'))
const ChooseRole = lazy(() => import('../views/pages/login/ChooseRole'))
const Reviewer = lazy(() => import('../views/pages/reviewer/dashboard/index'))
const Student = lazy(() => import('../views/pages/student/dashboard/index'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
//const ClassDetails = laze(() => import('../../views/pages/lecture/classes/tab-class'))

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()
    const role = getSelectedRole()
    if (user) {
      return getHomeRouteForLoggedInUser(role)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <Login /> }]
    },
    {
      path: '/choose-role',
      element: <BlankLayout />,
      children: [{ path: '/choose-role', element: <ChooseRole /> }]
    },
    {
      path: '/reviewer/dashboard',
      element: <BlankLayout />,
      children: [{ path: '/reviewer/dashboard', element: <Reviewer /> }]
    },
    {
      path: '/student/dashboard',
      element: <BlankLayout />,
      children: [{ path: '/student/dashboard', element: <Student /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
