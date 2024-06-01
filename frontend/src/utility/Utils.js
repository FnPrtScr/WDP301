import { DefaultRoute, HeadOfDepartmentRoute, LectureRoute, ReviewerRoute, StudentRoute } from '../router/routes'
import { valueOrDefault } from 'chart.js/helpers'
let _seed = Date.now()
import colorLib from '@kurkle/color'
// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))
export const getSelectedRole = () => localStorage.getItem('role')
export const getSelectedSemester = () => localStorage.getItem('semester')

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = () => {
  const role = window.localStorage.getItem('role')

  if (role === '1') return HeadOfDepartmentRoute
  if (role === '2') return LectureRoute
  if (role === '3') return ReviewerRoute
  if (role === '4') return StudentRoute
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})
// Trong file @utils

export function rand(min, max) {
  min = valueOrDefault(min, 0)
  max = valueOrDefault(max, 0)
  _seed = ((_seed * 9301) + (49297)) % (233280)
  return (min + (_seed / 233280)) * (max - min)
}

export function numbers(config) {
  const cfg = config || {}
  const min = valueOrDefault(cfg.min, 0)
  const max = valueOrDefault(cfg.max, 100)
  const from = valueOrDefault(cfg.from, [])
  const count = valueOrDefault(cfg.count, 8)
  const decimals = valueOrDefault(cfg.decimals, 8)
  const continuity = valueOrDefault(cfg.continuity, 1)
  const dfactor = Math.pow(10, decimals) || 0
  const data = []
  let i, value

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + rand(min, max)
    if (rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor)
    } else {
      data.push(null)
    }
  }

  return data
}

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}

export function transparentize(value, opacity) {
  const alpha = opacity === undefined ? 0.5 : 1 - opacity
  return colorLib(value).alpha(alpha).rgbString()
}
