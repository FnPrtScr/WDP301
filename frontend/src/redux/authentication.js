// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.accessToken))
      localStorage.setItem(config.storageRefreshTokenKeyName, JSON.stringify(action.payload.refreshToken))
    },
    handleCampus: (state, action) => {
      localStorage.setItem('campus', JSON.stringify(action.payload))
    },
    handleSemester: (state, action) => {
      localStorage.setItem('semester', JSON.stringify(action.payload))
    },
    handleChildrenData: (state, action) => {
      localStorage.setItem('dataProject', JSON.stringify(action.payload))
    },
    handleDataProjectStudent: (state, action) => {
      localStorage.setItem('dataProjectStudent', JSON.stringify(action.payload))
    },
    handleRole: (state, action) => {
      localStorage.setItem('role', JSON.stringify(action.payload))
    },
    handleLogout: state => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem('campus')
      localStorage.removeItem('semester')
      localStorage.removeItem('dataProject')
      localStorage.removeItem('dataProjectStudent')
      localStorage.removeItem('role')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
      document.cookie = `${config.storageTokenKeyName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }
})

export const { handleLogin, handleCampus, handleSemester, handleChildrenData, handleDataProjectStudent, handleRole, handleLogout } = authSlice.actions

export default authSlice.reducer